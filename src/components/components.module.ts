import { NgModule } from '@angular/core';
import { CountdownComponent } from './countdown/countdown';
import { NewsCardComponent } from './news-card/news-card';
import { IonicModule } from 'ionic-angular';
import { PhotoCardComponent } from './photo-card/photo-card';
@NgModule({
  declarations: [CountdownComponent, NewsCardComponent, PhotoCardComponent],
  imports: [IonicModule.forRoot(NewsCardComponent), IonicModule.forRoot(PhotoCardComponent)],
  exports: [CountdownComponent, NewsCardComponent, PhotoCardComponent]
})
export class ComponentsModule {}
