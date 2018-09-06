import { NgModule } from '@angular/core';
import { CountdownComponent } from './countdown/countdown';
import { NewsCardComponent } from './news-card/news-card';
import { IonicModule } from 'ionic-angular';
@NgModule({
  declarations: [
    CountdownComponent,
    NewsCardComponent
  ],
  imports: [
    IonicModule.forRoot(NewsCardComponent)
  ],
  exports: [
    CountdownComponent,
    NewsCardComponent
  ]
})
export class ComponentsModule { }
