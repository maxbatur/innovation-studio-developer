import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { BaseViewComponent, IViewComponent, RuntimeViewCanvasModule } from '@helix/platform/view/runtime';
import { RxViewComponent } from '@helix/platform/view/api';
import { IImageContainerParameters } from '../design/image-container.interface';
import { GetAssetPathService } from '../../../services/get-asset-path.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'com-example-test210500-image-container',
  styleUrls: ['./image-container.scss'],
  templateUrl: './image-container.component.html',
  imports: [CommonModule, RuntimeViewCanvasModule]
})
@RxViewComponent({
  name: 'com-example-test210500-image-container',
})
export class ImageContainerComponent extends BaseViewComponent implements OnInit,IViewComponent {
  // Contains the view component instance id.
  guid: string;
  // Contains the view component configuration.
  config: Observable<any>;
  // Contains the view component instance parameters.
  inputParams: IImageContainerParameters;
  assetRootPath = '';

  // Implementing set property and refresh apis.
  api = {
    // This will be called when an input parameter is set by a button "set property" action.
    setProperty: this.setProperty.bind(this)
  };

  constructor(private getAssetPathService: GetAssetPathService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.assetRootPath = this.getAssetPathService.getAssetRootPath('com.example.test210500');

    // Input parameters.
    this.config.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe((config: IImageContainerParameters) => {
      this.inputParams = config;
    });

    // Registering the custom set property and refresh implementations.
    this.notifyPropertyChanged('api', this.api);
  }

  // This method is triggered by a button "set property" action.
  setProperty(propertyPath: string, propertyValue: any): void | Observable<never>{
    switch (propertyPath) {
      case 'hidden': {
        this.inputParams.hidden = propertyValue;
        this.notifyPropertyChanged(propertyPath, propertyValue);
        break;
      }
      default: {
        return throwError(`Image Container : property ${propertyPath} is not settable.`);
      }
    }
  }
}
