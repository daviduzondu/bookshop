curl -X POST "http://localhost:3100/admin/add-product" \
-H "accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" \
-H "accept-language: en-GB,en-US;q=0.9,en;q=0.8,ar;q=0.7,la;q=0.6" \
-H "cache-control: max-age=0" \
-H "content-type: multipart/form-data; boundary=----WebKitFormBoundary5NeR3zp9UhKg2Hya" \
-H "sec-ch-ua: \"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"" \
-H "sec-ch-ua-mobile: ?0" \
-H "sec-ch-ua-platform: \"Linux\"" \
-H "sec-fetch-dest: document" \
-H "sec-fetch-mode: navigate" \
-H "sec-fetch-site: same-origin" \
-H "sec-fetch-user: ?1" \
-H "upgrade-insecure-requests: 1" \
-H "cookie: connect.sid=s%3A5USwp5_uO0G5F2EwnAIG0GAfiQ5YoiXC.1aIjv3T4dEYS1b9vixoCfV5bP%2BbF4hABvvLQVh6SJKU" \
-H "Referer: http://localhost:3100/admin/add-product" \
-H "Referrer-Policy: strict-origin-when-cross-origin" \
-d "------WebKitFormBoundary5NeR3zp9UhKg2Hya
Content-Disposition: form-data; name=\"title\"

The Mask of Sheep
------WebKitFormBoundary5NeR3zp9UhKg2Hya
Content-Disposition: form-data; name=\"image\"; filename=\"dancing_man.png\"
Content-Type: image/webp


------WebKitFormBoundary5NeR3zp9UhKg2Hya
Content-Disposition: form-data; name=\"price\"

23.33
------WebKitFormBoundary5NeR3zp9UhKg2Hya
Content-Disposition: form-data; name=\"description\"

Something very nice and worth understanding...
------WebKitFormBoundary5NeR3zp9UhKg2Hya
Content-Disposition: form-data; name=\"_csrf\"

gl5yrZVW-HmT-ClciEY7c9pzpmrtP9FWqWng
------WebKitFormBoundary5NeR3zp9UhKg2Hya--"
