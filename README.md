
# Model API

Sebuah API Backend Service yang menyediakan kumpulan aksara-aksara bali.API ini sudah berjalan dalam server cloud run dengan base url https://model-api-852069596535.asia-southeast2.run.app

## Endpoint route 




#### Prediksi Aksara 

```http
  /predict
```
- Method
  - POST
-  Header
  - ```Authorization``` value ```Bearer <token>```
- Body
  - ```image``` as ```file```
- Response
```
{
    "status": "success",
    "message": "Prediction successful",
    "data": {
        "id": "74cf3d87-aed4-490b-bef2-e077080173f7",
        "topPredictions": [
            "wa:99.93%",
            "ga:0.04%",
            "na:0.02%"
        ],
        "createdAt": "2024-12-06T06:53:35.732Z"
    }
}
```
#### Prediksi Result

```http
   /predict/latest
```
- Method
  - Get
-  Header
  - ```Authorization``` value ```Bearer <token>```
- Response
```
{
    "status": "success",
    "message": "Latest prediction retrieved successfully",
    "data": {
        "id": "7cd73138-8043-4144-b6d4-8208f5d76a66",
        "topPredictions": [
            "wa:99.93%",
            "ga:0.04%",
            "na:0.02%"
        ],
        "createdAt": "2024-12-07T02:26:28.944Z"
    }
}
```
#### Prediksi Handwriting

```http
   /predict/handwrite
```
- Method
  - POST
-  Header
  - ```Authorization``` value ```Bearer <token>```
-  Body
  - ```image``` as ```file```
- Response
```
{
    "status": "success",
    "message": "Prediction successful",
    "data": {
        "id": "d1206449-c971-429a-b20f-b0bacaa9f670",
        "topPredictions": [
            "wa:99.93%",
            "ga:0.04%",
            "na:0.02%"
        ]
    }
}
```
#### Prediksi Histories

```http
   /predict/histories
```
- Method
  - GET
-  Header
  - ```Authorization``` value ```Bearer <token>```
- Response
```
{
    "status": "success",
    "message": "Histories retrieved successfully",
    "data": [
        {
            "id": "7cd73138-8043-4144-b6d4-8208f5d76a66",
            "topPredictions": [
                "wa:99.93%",
                "ga:0.04%",
                "na:0.02%"
            ],
            "createdAt": "2024-12-07T02:26:28.944Z"
        },
```




## Bug/Error

Untuk Bug dan Error baru yang ditemukan dapat menghubungi contributor yang bersangkutan

