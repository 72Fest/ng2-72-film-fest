import { NgModule } from '@angular/core';
import { CountdownComponent } from './countdown/countdown';
import { NewsCardComponent } from './news-card/news-card';
@NgModule({
  declarations: [CountdownComponent,
    NewsCardComponent],
  imports: [],
  exports: [CountdownComponent,
    NewsCardComponent]
})
export class ComponentsModule { }
