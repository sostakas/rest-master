# rest-master
git clone git@github.com:sostakas/rest-master.git

<!-- build -->
sh {path start.sh}
<!-- clean -->
sh {path close.sh}

<!-- url -->
0.0.0.0:4200

<!-- 1 task -->
GET {url}/api/courses/
GET {url}/api/courses/{id}
POST {url}/api/courses/
PUT {url}/api/courses/{id}
PATCH {url}/api/courses/{id}
DELETE {url}/api/courses/{id}

<!-- 2 task -->
POST {url}/api/courses/{id}/notes 
<!-- 
{
	"title": "ha",
	"author": "petras",
	"comment": "labai idomus kursas",
	"expiration": "13-3-32-3"
}
 -->

GET {url}/api/courses/{id}/notes 
<!-- 
[
    {
        "title": "ha",
		"author": "petras",
		"comment": "labai idomus kursas",
		"expiration": "13-3-32-3"
    }
]
 -->
DELETE {url}/api/courses/{id}/notes/{note_title} 
<!-- 
	{
		"title": "ha",
		"author": "fsa",
		"comment": "sd",
		"expiration": "132-23-32"
	}
 -->