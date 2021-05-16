LAUNCH & CLI
- redis-server /usr/local/etc/redis.conf
- redis-cli (runs on port 6379 by default)  / -p PORT
- redis-cli COMMAND > cmds.txt -> outputs to file

MONITOR
- MONITOR
- REDIS-BENCHMARK -n 1000 (nb of commands)

CONFIG
- CONFIG GET *
- CONFIG GET port
- CONFIG GET patt*rn
- CONGIG SET option value (at runtime)
- INFO (server, clients, memory, persistence, stats, replication, cpu, commands, stats, all, default...)
- CONFIG RESETSTAT
- COMMAND
- COMMAND INFO name
- COMMAND COUNT
- CONFIG SET requirepass pwd
- AUTH pzd
-  /usr/local/etc/redis.conf 

CLIENTS
- CLIENT LISTS
- CLIENT SETNAME
- CLIENT GETNAME
- CLIENT KILL

GENERAL
- FLUSHALL
- SCAN 0 -> starts scanning. Returns a cursor. Run SCAN CURSOR to continue to scan. 
- SCAN COUNT NB -> returns nb of elements
- SCAN 0 MATCH string -> finds elements that have specific pattern
- SCAN 0 MATCH k* -> patterns
- KEYS pattern / KEYS *
- RANDOMKEY
- DEL key
- EXISTS key
- EXPIRE key sec
- PERSIST key -> remove timout
- TTL key -> returns -2 if gone, -1 if non-expirable
- RENAME old new

PATTERNS : 
- h?llo : one char can change
- h*llo : there can be any nb of char or no char between h and l
- h[ae]llo: can be a or e
- h[^e]llo: any one char but not e
- h[a-b]llo : hallo or hbllo

STRINGS:
- SET key value ->updates if key exists
- SETNX key value -> only if key does not exists
- MSET key1 val1 key2 val2
- MSETNX key1 val1 key2 val2 -> fails if one key already exists
- SETEX key sec value
- PSETEX -> same but milliseconds
- SETRANGE : overwrite a part of a string
- GET key
- MGET key1 key2
- GETSET - change value and see past value
- APPEND key value -> create or appends
- INCR/DECR key
- INCRBYFLOAT/DECRBYFLOAT
- INCRBY/DECRBY key amount
- GETRANGE key 0 1 / 0 -1 to the end

LISTS
- LPUSH/RPUSH key val
- LPUSHX/RPUSHX : only if list exists
- LRANGE key 0 -1
- LLEN
- LPOP/RPOP
- LTRIM key 1 2 : keep only indexes from 1 to 2
- LINSERT key before/after
- LINDEX key index -> see value at index
- SORT key (desc) ALPHA
- BLPOP key 1 (timeout sec) -> pops from list after timeout period

SETS
- SADD
- SREM
- SISMEMBER - test if value is in set
- SMEMBERS - returns members
- SCARD : count
- SMOVE s1 s2 val : move from one set to another
- SUNION : combine sets
- SDIFF : the differences of set2 compared to set1
- SINTER : returns common elements
- SIDFFSTORE/SINTERSTORE/SUNIONSTORE : newset set1 set2
- SRANDMEMBER key (nb)
- SPOP : removes and returns random member. possible to add a nb of members to remove.

SORTED SETS
- ZADD key score
- ZREM
- ZREMRANGEBYSCORE key 5 6 -> scores 5 and 6 will be removed
- ZREMRANGEBYRANK key 0 2 - removes by rank 0 to 2
- ZRANGE (ordred lowest to highest by index)
- ZREVRANGE
- ZRANGEBYSCORE - (ordred lowest to highest by score)
- ZRANK : returns rank of members with scores ordered from high to low.
- ZREVRANK
- ZCARD key
- ZCOUNT key 1 3 (count of element with scores btw start and end)
- ZINCRYBY/ZDECRBY -> increments, decrements score. If it does not exists, it will be added
- ZSCORE : returns score of member

HASHES:
- HSET user:1 name John -> sets field in hash
- HSETNX : only add non existent fields
- HMSET : adds more than one field
- HMGET: returns field
- HGETALL : all fields and values in hash
- HDEL : remove field from hash
- HEXISTS : check if field in hash
- HINCRBY/HDECRBY : on a field. If key does not exist, hash is created. if field does not exist, field is created.
- HINCRBYFLOAT/HDECRBYFLOAT
- HKEYS
- HVALS
- HLEN
- HSTRLEN : len of value of a field

HYPERLOGLOGS: count unique values
- PFADD key a b c d
- PFCOUNT key (key2 for total count)
- PFMERGE dest key key2

TRANSACTIONS:
- WATCH key -> before a transaction, which will not be executed if another client has changed the key during the time it took to type
- MULTI
- EXEC

PUB/SUB:
- subscribe weather ....
- psubscribe weat*
- publish weather "msg"
- PUBSUB channels : returns all channels being subscribed
- PUBSUB numpat : nb of channels subscribed to through patterns
- PUBSUB numsub : returns nb of subscribers

SCRIPTS
- EVAL "redis.call('set', KEYS[1], ARGV[1])" 1 key value   -> the nb is the number of key value pairs
- EVAL "redis.call('mset', KEYS[1], ARGV[1], KEY[2], ARGV[2])" 2 key value key2 value2
If I have a hash of country fields with their capitals, and a sorted set of countries.
- EVAL "local var = redis.call('ZRANGE', KEYS[1], O, -1); return redis.call('hmget', KEY[2], unpack(var));" 2 country country_capitals
- SCRIPT LOAD : "local var = redis.call('ZRANGE', KEYS[1], O, -1); return redis.call('hmget', KEY[2], unpack(var));"
- EVALSHA hash 2 country country_capitals
- SCRIPT EXISTS hash
- SCRIPT FLUSH

GEODATA
- GEOADD key long lat city
- ZRANGE key 0 -1
- GEOHASH key city
- GEOPOS key city -> long and lat values
- GEODIST key city1 city2 -> in meters / specify km/mi for km/mi
- GEORADIUS key long lat 500 km -> all other points within 500km / options : withcoord, withdist, withhash/asc/desc
- GEORADIUSBYMEMBER key city 500km

STREAMS : https://redis.io/topics/streams-intro
- XADD stream1 msgID data -> msg id use * for auto generation. Response is a timestamp in miliseconds + a sequence nb
- XADD stream1 MAXLEN 2 * data :keep in memory the messgaes defined by length, the rest in moved to physical storage
Query streams in non-blocking way
- XRANGE stream1 fromTimestramp toTimestamp  / option : count 10
- XRANGE stream1 - +
- XRANGE stream1 t1 +
- XREVRANGE
- XRANGE stream1 id + count 10 --> by id
In blocking way : 
- XREAD Blocl 0 streams stream1 $ --> 0 is mstimeout, $ means all msg afte subscription
- XGROUP create stream1 group1 $ - Create a group (will process all msgs and distribute it btw consumers)
- XREADGROUP GROUP group1 C1 BLOCK 2000 COUNT 10 STREAMS stream1 -> creates a consumer C1 that waits for msg from group1
- XACK stream1 group1 msgID: The XACK command removes one or multiple messages from the Pending Entries List (PEL) of a stream consumer group. A message is pending, and as such stored inside the PEL, when it was delivered to some consumer, normally as a side effect of calling XREADGROUP, or when a consumer took ownership of a message calling XCLAIM. The pending message was delivered to some consumer but the server is yet not sure it was processed at least once. So new calls to XREADGROUP to grab the messages history for a consumer (for instance using an ID of 0), will return such message. Similarly the pending message will be listed by the XPENDING command, that inspects the PEL.
- XPENDING stream1 group1 - + 10: list pending msgs ar a consumer level
- XCLAIM stream1 group1 C2 time msgID: claim ownership of pending msg -> by a consumer who's had the msg, it is not stuck for him yet it was not ACKED and still is in the PEL (which means that it was read by a consumer that has failed to process it).
- XINFO streal stream1
- XINFO GROUPS stream1
- INFO consumers stream1
- XDEL stream1 msgID

RDB :
- SAVE
- BGSAVE
- configured in config file
- dump.rdb file is in /usr/local/var/db/redis 
- backup db and dump.rdb file : diff-backup --preserve-numerical-ids /usr/local/var/db/redis/ /Users/helenebrulin/Desktop/redis-backup
- crontab -e : 0 0 * * *  rdiff-backup --preserve-numerical-ids /usr/local/var/db/redis/ /Users/helenebrulin/Desktop/redis-backup
(everyday at midnight)

AOF
- BGREWRITEAOF
- in config file set appendonly to yes
- backup the aof file with diff-backup


SENTINEL
- redis-server /usr/local/etc/redis.conf --> 6379
- redis-server /usr/local/etc/redis-slave.conf --> 6380
- redis-sentinel /usr/local/etc/redis-sentinel.conf, & 2 & 3 --> 26379, 26380, 26381
- redis-cli -p for each port
- SENTINEL MASTERS
- SENTINEL master mymaster
- SENTINEL sentinels mymaster
- SENTINEL get-master-addr-by-name mymaster
