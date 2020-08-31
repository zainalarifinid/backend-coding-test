const request = require('supertest');
const expect = require('expect.js');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      return done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it.skip('should return SERVER_ERROR', (done) => {
      // eslint-disable-next-line global-require
      const mockAppWithNulldb = require('../src/app')(null);
      request(mockAppWithNulldb)
        .get('/rides')
        .expect({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });

    it('should return RIDES_NOT_FOUND_ERROR', (done) => {
      request(app)
        .get('/rides')
        .expect({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return data', (done) => {
      const values = [0, 0, 0, 0, 'zainal', 'arifin', 'Jimny'];
      db.run(
        'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
        values
      );

      request(app)
        .get('/rides')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.a(Array);
          return done();
        });
    });
  });

  describe.skip('POST /rides', () => {
    it('should return error if given start_lat < -90', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: -180,
          start_long: 0,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given start_lat > 90', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 180,
          start_long: 0,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given start_long < -180', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: -190,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given start_long > 180', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 190,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given end_lat < -90', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: -180,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given end_lat > 90', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 180,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given end_long < -180', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 0,
          end_long: -190,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given end_long > 180', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 0,
          end_long: 190,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message:
            'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given empty rider_name', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 0,
          end_long: 0,
          rider_name: '',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message: 'Rider name must be a non empty string',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given empty driver_name', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: '',
          driver_vehicle: 'Jimny',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message: 'Rider name must be a non empty string',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return error if given empty driver_vehicle', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: '',
        })
        .expect({
          error_code: 'VALIDATION_ERROR',
          message: 'Rider name must be a non empty string',
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
    it('should return correct data if given correct ride data', (done) => {
      request(app)
        .post('/rides')
        .send({
          start_lat: 0,
          start_long: 0,
          end_lat: 0,
          end_long: 0,
          rider_name: 'zainal',
          driver_name: 'arifin',
          driver_vehicle: 'Jimny',
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.length).to.be.above(0);
          // {
          //   startLat: 0,
          //   startLong: 0,
          //   endLat: 0,
          //   endLong: 0,
          //   riderName: 'zainal',
          //   driverName: 'arifin',
          //   driverVehicle: 'Jimny',
          // }
          return done();
        });
    });
  });
});
