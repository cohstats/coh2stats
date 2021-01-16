### Database structure

#### The stats Data structure
```
root /stats/daily/timestamp?/

1v1
- totalMatches
- ostheer

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


