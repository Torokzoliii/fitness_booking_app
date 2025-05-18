# Fitness Booking App
Programrendszerek projektmunka (Fitness csoport foglalási rendszer)

* Török Zoltán
* FL19JV

## A struktúra
* frontend(Angular)
* backend(NodeJS,ExpressJS)
* db(Mongo)

## Megvalósított funkciók:
* Fitness csoportok kezelése (létrehozás, szerkesztés, törlés, megtekintés)
* Foglalások kezelése (foglalás, lemondás, várólista)
* Edzők és csoportok listázása
* Tagok regisztrációja és előrehaladásuk követése
* Értékelési rendszer (csoportok és edzők értékelése)
* Adminisztrátor nézet és jogosultságok

## Hiányos:
* Jobban kidolgozott UI
* Hibakezelés fejlesztése bizonyos helyeken
* Fejlettebb analitika és riportok

## Projekt elindítása:
* Frontend: npm install && ng serve
* Backend: npm install && npx tsc && npm start
* Adatbázis: docker build -t mongodb . majd futtatás
