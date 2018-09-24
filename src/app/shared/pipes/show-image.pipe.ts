import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "../../../environments/environment";

@Pipe({
  name: "showImage"
})
export class ShowImagePipe implements PipeTransform {
  transform(imageURL: string): string {
    if (imageURL) {
      return imageURL;
    }
    return "";
  }
}
