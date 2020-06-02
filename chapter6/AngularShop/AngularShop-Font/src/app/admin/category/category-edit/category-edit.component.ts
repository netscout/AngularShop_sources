import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, AsyncValidatorFn, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Category } from "src/app/models/category";
import { CategoryService } from 'src/app/services/category.service';
import { BaseTreeFormComponent } from 'src/app/base.tree-form.component';

@Component({
  selector: 'app-admin-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class AdminCategoryEditComponent
  extends BaseTreeFormComponent
  implements OnInit {
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
    private categoryService: CategoryService
  ) {
    super();
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
    this.categoryService.getEntireCategoryTree<Category>()
      .subscribe(result => {
        this.dataSource.data = result;

        //URL을 통해 넘어온 id값을 가져오기
        //신규 항목 추가라면 빈 값
        this.id = +this.activatedRoute.snapshot.paramMap.get('id');

        if(this.id) {
          //기존 항목 편집
          this.categoryService.get<Category>(this.id)
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
      this.categoryService.put<Category>(category)
        .subscribe(result => {
          console.log(`Category ${category.id} has been updated.`);

          this.router.navigate(['/admin-categories']);
        },
        error => console.error(error));
    }
    else {
      //새 항목 추가
      this.categoryService.post<Category>(category)
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

        return this.categoryService.isDupeField(
          categoryId,
          fieldName,
          control.value)
          .pipe(map(result => {
            return (result ? { isDupeField: true } : null);
          }));
      }
  }
}
