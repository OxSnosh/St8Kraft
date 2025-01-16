# DATA STRUCTURES

```
sample air battle request
curl -X POST -H "content-type:application/json" "http://localhost:8082/" --data '{ "id": 50, "data": { "defenderFightersArr": [5, 5, 5, 5, 5, 5, 5, 5, 5], "attackerFightersArr": [0, 0, 0, 0, 0, 0, 9, 9, 9], "attackerBombersArr": [0, 0, 0, 0, 0, 0, 0, 0, 7],"randomNumbers":[ "239409348093481239871230197429836192848723198326198471982371", "8971673963491872653498715697162349871654379821349123041059786", "3213498798798546352132165496847980650659819805649849846513200","4123640894763262603231098759852041236070674042989691956074095", "2504104134176791881701260213164026342175826054201460214749196"]} }' 

```

```
sample senate election request
url -X POST -H "content-type:application/json" "http://localhost:8081/" --data '{ "id": 50, "data": { "team":1, "votes": [1, 1, 1, 1, 2, 2, 2, 2, 5, 5, 5, 5, 5, 4, 4, 4, 3, 8, 8, 8, 8, 8, 8, 7, 9, 12, 51, 655]} }'

```

```
sample spy operations request
curl -X POST -H "content-type:application/json" "http://localhost:8083/" --data '{ "id": 50, "data": { "owner": 0, "attackType": 5} }' 
```
