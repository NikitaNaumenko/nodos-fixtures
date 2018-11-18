# Nodos fixtures

Fixtures for [Nodos framework](https://github.com/nodosjs/nodos)

## Requirements
* Nodejs >= 10

### Development: 

```
$ git clone <this repo>
$ cd nodos-fixtures
$ make setup
$ make test
```

### Run lint:
```
make lint
```

### Configuration

Setup your config for database in `__test__/fixures/config.json`:
```json
{
    "name": "default",
    "schema": "test_schema",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "test",
    "password": "test",
    "database": "test",
    "synchronize": true
}
```

And load fixtures: 
```
make run
```