import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, AsyncValidatorFn, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

import { Category } from "src/app/models/category";
import { FlatNode } from "src/app/models/flat-node";
import { environment } from "@envs/environment";
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-admin-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class AdminCategoryEditComponent implements OnInit {
  //제품 분류 데이터를 트리 노드로 변환하는 함수
  private _transfomer = (node: Category, level: number) => {
    return {
      expandable: !!node.children && node.children.length >0,
      name: node.name,
      id: node.id,
      level: level
    };
  }

  //트리 컴포넌트에서 사용할 컨트롤 설정
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  //제품 분류 데이터에서 트리 데이터를 생성
  treeFlattener = new MatTreeFlattener(
    this._transfomer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  //트리 컴포넌트의 데이터 소스 설정
  dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );

  //확장 가능한(자식이 있는) 노드인지 확인 함수
  hasChild = (_:number, node: FlatNode) => node.expandable;

  currentNode = null;
  parentNode = null;
  selectedNode = null;

  //입력폼 객체
  form: FormGroup;

  error: string;

  //view 타이틀
  title: string;

  //편집할 category 객체
  category: Category;

  //새로 만드는 경우 id는 null
  id?: number;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    //입력폼 생성
    this.form = this.formBuilder.group({
      name: ['',
        Validators.required, //필수 입력 필드로 설정
        this.isDupeField("name") //입력 데이터 중복 검사
      ]
    });

    this.loadData();
  }

  loadData() {
    this.loading = true;

    //제품 분류 전체 트리를 가져오기
    this.http.get<Category[]>(
      `${environment.baseUrl}api/Categories/EntireCategoryTree`
      )
      .subscribe(result => {
        this.dataSource.data = result;

        //URL을 통해 넘어온 id값을 가져오기
        //신규 항목 추가라면 빈 값
        this.id = +this.activatedRoute.snapshot.paramMap.get('id');

        if(this.id) {
          //기존 항목 편집
          this.http.get<Category>(
            `${environment.baseUrl}api/Categories/${this.id}`
            )
            .subscribe(result => {
              this.category = result;
              this.title = `편집 - ${this.category.name}`;

              //현재 편집하는 id를 가진 노드를 찾아서 현재 노드 설정
              this.currentNode = this.treeControl.dataNodes
                .filter(x => x.id == this.category.id)[0];
              //현재 노드의 부모 노드 설정
              this.parentNode = this.getParentNode(this.currentNode);

              //제품 분류 값을 입력폼에 설정
              this.form.patchValue(this.category);
            },
            error => this.error = error);
        }
        else {
          //새 항목 추가

          this.title = "새 분류 만들기";
        }

        //트리 전체 확장
        this.treeControl.expandAll();

        this.loading = false;
      },
      error => this.error = error);
  }

  //수정/저장시 입력 폼을 서버에 전송
  onSubmit() {
    this.loading = true;

    let category = (this.id) ? this.category : <Category>{};

    category.name = this.form.get("name").value;
    category.parentId = this.parentNode ? this.parentNode.id : null;

    if(this.id) {
      //기존 항목 편집
      this.http.put<Category>(
        `${environment.baseUrl}api/Categories/${category.id}`,
        category)
        .subscribe(result => {
          console.log(`Category ${category.id} has been updated.`);

          this.router.navigate(['/admin-categories']);
        },
        error => console.error(error));
    }
    else {
      //새 항목 추가
      this.http.post<Category>(
        `${environment.baseUrl}api/Categories`,
        category)
        .subscribe(result => {
          console.log(`Category ${category.id} has been created.`);

          this.router.navigate(['/admin-categories']);
        },
        error => console.error(error));
    }

    this.loading = false;
  }

  //입력 값을 서버로 보내 중복 검사
  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl):
      Observable<{[key: string]: any} | null> => {
        let categoryId = (this.id) ? this.id.toString() : "0";

        var params = new HttpParams()
          .set("categoryId", categoryId)
          .set("fieldName", fieldName)
          .set("fieldValue", control.value);

        return this.http.post<boolean>(
          `${environment.baseUrl}api/Categories/IsDupeField`,
          null,
          { params })
          .pipe(map(result => {
            return (result ? { isDupeField: true } : null);
          }));
      }
  }

  //입력 폼의 FormControl에 에러가 하나라도 있다면.
  hasError(name: string) {
    let c = this.form.get(name);
    //dirty는 입력 폼의 값이 변경 되었는지를 나타내고
    //touched는 사용자가 입력 폼을 클릭했는지
    //invalid는 에러가 존재하는지를 확인
    return c && (c.dirty || c.touched) && c.invalid;
  }

  //입력 폼의 FormControl에 Required인 값이 입력되지 않았다면
  hasRequiredError(name: string) {
    let c = this.form.get(name);
    return c && c.errors?.required;
  }

  //입력 폼의 FormControl에 입력된 값이 이미 존재하는 값이라면
  hasDupeFieldError(name: string) {
    let c = this.form.get(name);
    return c && c.errors?.isDupeField;
  }

  //노드 선택이 변경될 때 호출
  selectionChanged(node) {
    if(this.currentNode != node)
    {
      this.selectedNode = node;
      this.parentNode = node;
    }
  }

  setRootNode() {
    this.selectedNode = null;
    this.parentNode = null;
  }

  isCurrentNode(node) {
    return this.currentNode == node;
  }

  isParentNode(node) {
    return this.parentNode == node;
  }

  //넘겨 받은 노드의 부모 노드를 리턴
  private getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
