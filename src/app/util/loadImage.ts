export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject): void => {
		const image: HTMLImageElement = new Image();
		image.crossOrigin = "Anonymous";
		image.onload = () => resolve(image);
		image.onerror = (e: string | Event) => reject(e);
		image.src = src;
	});
}
