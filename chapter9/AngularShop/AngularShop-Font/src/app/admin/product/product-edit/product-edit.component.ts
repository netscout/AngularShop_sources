import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BaseTreeFormComponent } from "src/app/base.tree-form.component";

import { Product } from "src/app/models/product";
import { ProductService } from "src/app/services/product.service";
import { Category } from 'src/app/models/category';
import { Maker } from 'src/app/models/maker';
import { FlatNode } from 'src/app/models/flat-node';

@Component({
  selector: 'app-admin-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class AdminProductEditComponent
  extends BaseTreeFormComponent {
  //html의 id가 fileInput 컨트롤을 참조
  @ViewChild('fileInput') fileInput;

  error: string;

  //view 타이틀
  title: string;

  //편집할 product 객체
  product: Product;
  makers: Maker[];
  //제품이 속할 분류 목록
  selectedNodes: FlatNode[];

  //제품의 이미지 url목록
  photoUrls: string[] = [];
  //이미지 업로드를 위해 선택된 파일 목록
  seletedFiles = [];

  //새로 만드는 경우 id는 null
  id?: number;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['',
        Validators.required, //입력 필수
        this.isDupeField("name") //제품 명 중복 검사
      ],
      description: ['',
        Validators.required //제품 설명 입력 필수
      ],
      makerId: ['',
        Validators.required //제조 회사 선택 필수
      ],
      tags: ['',
        Validators.required //태그 입력 필수
      ],
      price: ['',
        [
          Validators.required, //가격 입력 필수
          //가격은 소수점 둘째자리 까지 포함하는 숫자
          Validators.pattern('^([0-9]+)(\.)?[0-9]{0,2}$')
        ],
      ],
      discount: ['',
        [
          //할인율은 소수점 둘째자리 까지 포함하는 숫자
          Validators.pattern('^([0-9]+)(\.)?[0-9]{0,2}$'),
          //할인율 최대 값은 100
          Validators.max(100)
        ],
      ],
      stockCount: ['',
        [
          Validators.required, //재고 입력 필수
          //재고는 양수의 숫자값만 가능
          Validators.pattern('^[0-9]+$')
        ],
      ],
      isVisible: [''
      ]
    });

    this.loadData();
  }

  loadData() {
    this.loading = true;

    //제조 회사 목록 가져오기
    this.loadMakers();

    //전체 분류 트리 가져오기
    this.productService.getEntireCategoryTree<Category>()
      .subscribe(result => {
        //트리 컴포넌트의 데이터에 세팅
        this.dataSource.data = result;

        this.treeControl.expandAll();

        //추가 / 편집 제품 데이터 가져오기
        this.loadProduct()
      },
      error => this.error = error);
  }

  loadMakers() {
    this.productService.getMakers()
      .subscribe(result => {
        this.makers = result;
      })
  }

  loadProduct() {
    //URL에서 제품 번호 가져오기
    //신규 제품 추가인 경우 빈 값
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if(this.id) {
      //기존 항목 편집
      this.productService.get<Product>(this.id)
        .subscribe(result => {
          this.product = result;
          this.title = `편집 - ${this.product.name}`;

          //현재 제품이 속한 분류 번호를 저장
          this.product.categoryIds = this.product.categories.map(c => c.id);

          //현재 제품이 속한 분류를 트리 컴포넌트에서 찾아서 저장
          this.selectedNodes = this.treeControl.dataNodes
            .filter(x => this.product.categoryIds.includes(x.id));

          //현재 제품과 연관된 이미지 경로 저장
          this.photoUrls = this.product.photoUrls;

          //서버에서 가져온 값을 입력 폼에 세팅
          this.form.patchValue(this.product);

          this.loading = false;
        },
        error => this.error=error);
    }
    else {
      //새 항목 추가
      this.title = "새 분류 만들기";

      this.loading = false;
    }
  }

  onSubmit() {
    this.loading = true;

    let product = (this.id) ? this.product : <Product>{};

    //이미지를 같이 서버로 전송하기 위해 multipart-formdata 사용
    const formData = new FormData();
    if(this.id) {
      formData.append("id", this.id.toString());
    }
    //업로드 되는 파일을 photos에 목록으로 추가
    for(let file of this.seletedFiles) {
      formData.append("photos", file);
    }

    product.name = this.getValue("name");
    product.description = this.getValue("description");
    product.makerId = +this.getValue("makerId");
    product.categoryIds = this.selectedNodes.map(sn => sn.id);
    product.tags = this.getValue("tags");
    product.price = +this.getValue("price");
    product.discount = +this.getValue("discount");
    product.stockCount = +this.getValue("stockCount");
    product.isVisible = this.getValue("isVisible");
    product.photoUrls = this.photoUrls.filter(pu => pu.startsWith("images/"))

    //제품 데이터는 json으로 직렬화하여 폼데이터에 추가
    formData.append("product", JSON.stringify(product));

    if(this.id) {
      //기존 항목 편집
      this.productService.put<Product>(formData)
        .subscribe(result => {
          console.log(`Product ${product.id} has been updated.`);

          this.router.navigate(['/admin-products']);
        },
        error => console.error(error));
    }
    else {
      //새 항목 추가
      this.productService.post<Product>(formData)
        .subscribe(result => {
          console.log(`Product ${product.id} has been created.`);

          this.router.navigate(['/admin-products']);
        },
        error => console.error(error));
    }

    this.loading = false;
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl):
      Observable<{[key: string]: any} | null> => {
        let productId = (this.id) ? this.id.toString() : "0";

        return this.productService.isDupeField(
          productId,
          fieldName,
          control.value)
          .pipe(map(result => {
            return (result ? { isDupeField: true } : null);
          }));
      }
  }

  //사용자가 트리에서 항목을 선택할 때 발생
  selectionChanged(node) {
    if(!this.selectedNodes) {
      this.selectedNodes = [];
    }

    //선택된 분류 안에 있으면 제거.
    const idx = this.selectedNodes.indexOf(node);
    if(idx > -1) {
      this.selectedNodes.splice(idx, 1);
    }
    //선택된 분류 안에 없으면 추가.
    else {
      this.selectedNodes.push(node);
    }
  }

  //제품이 속한 분류 초기화
  clearSelectedNode() {
    this.selectedNodes.length = 0;
  }

  isSelectedNode(node) {
    if(this.selectedNodes)
    {
      return this.selectedNodes.includes(node);
    }

    return false;
  }

  getSelectedNodeNames() {
    if(this.selectedNodes)
    {
      return this.selectedNodes.map(sn => sn.name).join(", ");
    }

    return "";
  }

  //파일 업로드를 통해 이미지를 선택할 때 발생
  onImageFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      let fileCount = event.target.files.length;
      for (let i = 0; i < fileCount; i++) {
        let reader = new FileReader();

        reader.onload = (event:any) => {
          this.photoUrls.push(event.target.result);
        }

        const file = event.target.files[i];
        reader.readAsDataURL(file);
        this.seletedFiles.push(file);
      }
    }
  }

  //이미지 목록에서 제거
  removeImage(photoUrl) {
    console.log(photoUrl);
    if(this.photoUrls && this.photoUrls.length > 0) {
      let idx = this.photoUrls.indexOf(photoUrl);

      if(idx > -1) {
        //이미 가지고 있던 사진과 새로 추가된 사진 간의 인덱스 차이 계산
        //만약 delta가 음수 값이라면 새로 업로드된 파일이 아님
        let delta = this.photoUrls.length - this.seletedFiles.length;
        this.photoUrls.splice(idx, 1);

        if(this.seletedFiles.length > 0 && delta > -1) {
          this.seletedFiles.splice(idx - delta, 1);
        }
      }
    }
  }
}
