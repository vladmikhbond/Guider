
import {
  Component,
  ElementRef,
  EventEmitter, Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: `app-tmenu`,
  styles: [
    `.mmRoot, .mmUpperItem, .mmItem {
      background-color: aqua;
      width: 70px;
      min-width: 70px;
      max-width: 70px;
    }`,

      `.mmUpperItem, .mmItem {
      padding-top: 10px;
      text-align: center;
      border-bottom: solid 1px black;
      height: 40px;

    }`,

      `.mmUpperItem {
      margin-bottom: -10px;
    }`,
    `.mmItem {

     }`,

      `.mmRoot {
      height: 50px;
      border: black 1px solid;
     }`,
      `.mmUpperCont {
      display: none;
      position: absolute;
    }`,
    `.mmCont {
      overflow: auto;
      border: 1px solid lightblue;
      position: fixed;
      top: 50px;
      bottom: 10px;
    }`,
      `ul {
      padding-inline-start: 5px;
      list-style-type: none;
      }`
  ],
  template: `
    <button class="mmRoot" (click)="onRootClick()" #rootButton>{{selTag}}</button>
    <div class="mmUpperCont" [style.left]="mmUpperContStyleLeft" #rootCont>

      <ul *ngFor="let upperItem of upperItems; let i = index;">

        <li class="mmUpperItem" (click)="onUpperItemClick(i)">{{upperItem}}</li>
        <ul class="mmCont" [style.display]="mmContStyleDisplays[i]" [style.left]="mmContStyleLeft"
            [style.top]="mmContStyleTop">
          <li class="mmItem" *ngFor="let item of itemLists[i]" (click)="onItemClick(item)">{{item}}</li>
        </ul>

      </ul>

    </div>
  `
})
export class TmenuComponent {
  @ViewChild('rootButton', {static: false})
  rootButton: ElementRef<HTMLButtonElement>;
  @ViewChild('rootCont', {static: false})
  rootCont: ElementRef<HTMLElement>;

  @Input()
  selTag = 'Menu';
  @Input()
  set upperItems(v: string[]) {
    this.upItemsFld = v;
    // do menus invisible & prepare indices array
    v.forEach(() => this.mmContStyleDisplays.push('none'));
  }
  get upperItems(): string[] {
    return this.upItemsFld;
  }
  private upItemsFld: string[] = [];
  @Input()
  itemLists: string[][] = [];

  mmContStyleDisplays: string[] = [];
  mmUpperContStyleLeft: string;
  mmContStyleLeft: string;
  mmContStyleTop: string;

  @Output()
  open: EventEmitter<null> = new EventEmitter();
  @Output()
  itemSelected: EventEmitter<string> = new EventEmitter();

  // open upper Ccont
  onRootClick() {
    const el = this.rootCont.nativeElement;
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
    // upper
    const upperShift = this.rootButton.nativeElement.offsetLeft;
    this.mmUpperContStyleLeft = upperShift + 'px';
    const height = screen.availHeight - 150;
    this.mmContStyleLeft = height + 'px';
    this.open.emit();
  }

  // open lower Ccont
  onUpperItemClick(i: number) {
    for (let k = 0; k < this.mmContStyleDisplays.length; k++) {
      if (k === i) {
        if (this.mmContStyleDisplays[i] === 'block') {
          this.mmContStyleDisplays[i] = 'none';
        } else {
          this.mmContStyleDisplays[i] = 'block';
        }
      } else {
        this.mmContStyleDisplays[k] = 'none';
      }
    }
    // lower
    const arr = Array.prototype.slice.call( this.rootCont.nativeElement.children);
    const width = Math.max(...arr.map((e: { clientWidth: any; }) => e.clientWidth));

    const left = this.rootCont.nativeElement.offsetLeft + width;
    this.mmContStyleLeft = left + 'px';
    const top = this.rootCont.nativeElement.offsetTop + 30;
    this.mmContStyleTop = top + 'px';

  }

  onItemClick(item: string) {
    // hide all menus
    this.mmContStyleDisplays.fill('none');
    this.rootCont.nativeElement.style.display = 'none';
    //
    this.selTag = item;
    this.itemSelected.emit(item);
  }

}
