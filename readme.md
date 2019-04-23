# rest-master
clone 

sh {path start.sh}
sh {path close.sh}

url 0.0.0.0:4200

GET {url}/api/courses/
GET {url}/api/courses/{id}
POST {url}/api/courses/
PUT {url}/api/courses/{id}
PATCH {url}/api/courses/{id}
DELETE {url}/api/courses/{id}


POST {url}/api/courses/{id}/notes 
GET {url}/api/courses/{id}/notes 
DELETE {url}/api/courses/{id}/notes/{note_title} 