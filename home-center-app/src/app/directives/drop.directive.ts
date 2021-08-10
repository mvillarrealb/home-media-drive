import {   
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener, 
  ElementRef
} from '@angular/core';

@Directive({
  selector: 'div[drop-upload]'
})
export class DropDirective {

  @HostBinding('class.fileover') fileOver: boolean;

  @Output() fileDropped = new EventEmitter<any>();
  constructor(private el: ElementRef) {
    //el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('dragover', ['$event'])
  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    //if(!this.el.nativeElement.classList.contains('fileover'))  {
      this.el.nativeElement.classList.add('fileover');
    //}
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    setTimeout(() => {
      this.el.nativeElement.classList.remove('fileover');
    },3000);
    //
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.el.nativeElement.classList.remove('fileover');
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      let fileArray = [];
      for(let i = 0; i < files.length;i++) {
        fileArray.push(files[i]);
      }
      this.fileDropped.emit(fileArray);
    }
  }
}
