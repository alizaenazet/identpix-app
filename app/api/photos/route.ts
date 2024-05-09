
export async function GET(request: Request) {
    const photos = [
        "1xADZ6kjAXxBL34WlT-cxW1yr9PoH7HH0",
        "1lYUJfXdgd015lF863jbEJ9RgCSFQ16sF",
        "1zjeOT5jp_sjvH7DJ_skI3iLEerjJQrKX",
        "1NjT84kz1O2PQs_ZveiTgW2gyEvcmZpgx",
        "1MTEEBnWZ04pxzOOBx82FNmc7iocZZe84",
        "1o1Sel2MnYM3ZSS9CnKuh0Db6B10B5LiG",
        "1pG0FM79JOmE6HcZjlWbWVSxFBh67EQ7F",
        "1EKcWItPnrk5rAkVWAZmF3RyX8LstnNNQ",
        "1p8but6tpCg-DuWlDGwvSpnEa8DCKaKia",
        "1cksAqrtI2VdyDlxInRwchwbbEFF58YXY",
        "1Dq4gVZYP5Kzoz5j3x9ZbSy6Ify3Svf0x",
        "1HscOoKW1xB6HuJBqRsHOlL_-dIxprAze",
        "1ZbBe0KuNTaxvGHWrH7H8Tzg5m2NBDzqy",
        "1wB7PPKWjevbS0CuDaR2VSJBnqlm5NNLi",
        "1B8-oXSXfKH34Wk-C51jbGFspa8JEH0vr",
        "1GUv4YK_RjeGRITecqDJif8Ik21Gz2aFn",
        "1NOc5Y8zvYxEhc_ESaURZFgVhNzaQ2z7B",
        "1gWXxfuNKQ-L5P33yWj9G6v8oyHgsQYHz",
        "1K1wBP4gfMJIQhk4j12gWdLDl7wzsQaQp",
        "1b8aQiLUHZaBZo5df94R7V8HoY7YJsWFN",
]
 return Response.json(photos) 
}