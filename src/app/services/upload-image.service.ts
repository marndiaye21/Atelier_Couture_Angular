import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UploadImageService {

	displayImage(file: File): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			if (!file) {
				resolve("");
				return;
			}
			const fileReader = new FileReader();
			fileReader.onload = () => {
				if (!/\.(jpe?g|png|svg|gif|webp|bmp)$/.test(file.name.toLowerCase())) {
					resolve("");
				} else {
					resolve(fileReader.result as string);
				}
			};
			fileReader.readAsDataURL(file);
		});
	}
}
