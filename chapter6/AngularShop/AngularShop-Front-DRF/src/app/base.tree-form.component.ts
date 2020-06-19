import { Component } from "@angular/core";
import { BaseFormComponent } from './base.form.component';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { Category } from './models/category';
import { FlatNode } from './models/flat-node';

@Component({
  template: ''
})
export class BaseTreeFormComponent
  extends BaseFormComponent {
  //제품 분류 데이터를 트리 노드로 변환하는 함수
  protected _transfomer = (node: Category, level: number) => {
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

  constructor(
  ) {
    super();
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
  protected getParentNode(node: FlatNode): FlatNode | null {
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
