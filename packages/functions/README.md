### Database structure

#### The stats Data structure
```
root /stats/daily/timestamp?/1v1/

TODO: TBD think about a way to store
the stats data.

stats
- matchesCount: number
- wermachtCount: number
- wermachtWins: number
- sovietCount: number
- sovietWins: number
...

maps
- name: number
- name: number
...

commanders:
- name: number
- name: number 


```



#### Ladders data structure
Question is if we even want to store the ladders in the DB.
Maybe it just takes a space?

```
/ladders/<datetimestamp>/1v1/soviet  
/ladders/<datetimestamp>/1v1/wehrmacht  
/ladders/<datetimestamp>/1v1/...  
/ladders/<datetimestamp>/1v1/...  
/ladders/<datetimestamp>/2v2...  
/ladders/<datetimestamp>/3v3...
/ladders/<datetimestamp>/4v4...  
/ladders/<datetimestamp>/teamof2...  
/ladders/<datetimestamp>/teamof3...  
/ladders/<datetimestamp>/teamof4... 
```


