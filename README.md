# TWOMOJI

### API

#### How to use

You must have the `Content-Type:application/json` header set.

All list endpoints are formatted:
```
{
  "num_results": 1, 
  "objects": [ DATA GOES HERE ], 
  "page": 1, 
  "total_pages": 1
}
```


GET `/users`
GET `/users/:id`
```
{
  "id": 1, 
  "username": "firstuser", 
  "usertargets": [
    {
      "id": 6, 
      "points": 8, 
      "target_id": 2, 
      "user_id": 1
    }
  ]
}
```

GET `/targets` 
GET `/targets/:id`
```
{
  "emoji_pair": "\u270c\ud83d\udc7b", 
  "id": 9, 
  "status": 1, 
  "submissions": [], 
  "weight": 6
}
```

GET `/submissions`
GET `/submissions/:id`
POST `/submissions`
```
{
  "description": "super cooool", 
  "id": 4, 
  "photo": "photowoo", 
  "score": 0, 
  "target_id": 2, 
  "user_id": 1, 
  "users": {
    "emoji_pair": "smile/tree", 
    "id": 2, 
    "status": 0, 
    "weight": 0
  }
}
```

GET `/user_targets`
POST `/user_targets`
PATCH `/user_targets`
```
{
  "id": 6, 
  "points": 8, 
  "target_id": 2, 
  "user_id": 1, 
  "users": {
    "id": 1, 
    "username": "firstuser"
  }
}
```