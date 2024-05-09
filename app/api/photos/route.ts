
export async function GET(request: Request) {
    const photos = [
        "/images/10_dummy_gdrive_images_2.jpg",
        "/images/6_dummy_gdrive_images_2.jpg",
        "/images/6_dummy_gdrive_images.jpg",
        "/images/7_dummy_gdrive_images_2.jpg",
        "/images/7_dummy_gdrive_images.jpg",
        "/images/8_dummy_gdrive_images_2.jpg",
        "/images/8_dummy_gdrive_images.jpg",
        "/images/9_dummy_gdrive_images_2.jpg",
        "/images/9_dummy_gdrive_images.jpg",
        "/images/10_dummy_gdrive_images.jpg",
        "/images/11_dummy_gdrive_images_2.jpg",
        "/images/11_dummy_gdrive_images.jpg",
        "/images/12_dummy_gdrive_images_2.jpg",
        "/images/12_dummy_gdrive_images.jpg",
        "/images/13_dummy_gdrive_images_2.jpg",
        "/images/13_dummy_gdrive_images.jpg",
        "/images/14_dummy_gdrive_images_2.jpg",
        "/images/14_dummy_gdrive_images.jpg",
        "/images/15_dummy_gdrive_images_2.webp",
        "/images/15_dummy_gdrive_images.webp",
]
 return Response.json(photos) 
}