const path = require("path");
const request = require("supertest");

const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));

const ATTACHED_PATH = "/notes";

describe("App", () => {


  describe("returns 404 if no result found", () => {
    test("get returns 404 on /?state=Colorado", async () => {
  
        const response = await request(app)
          .get(`/?state=Colorado`)
          .set("Accept", "application/json");
  
        expect(response.status).toBe(404);
        expect(response.body.error).toContain("No Results");
    });
  });

  describe("path /", () => {
    test("get returns list of all clinics", async () => {
      const expected = [
        {
            "clinicName": "Good Health Home",
            "state": "AK",
            "availability": {
                "from": "10:00",
                "to": "19:30"
            }
        },
        {
            "clinicName": "Mayo Clinic",
            "state": "FL",
            "availability": {
                "from": "09:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "Cleveland Clinic",
            "state": "NY",
            "availability": {
                "from": "11:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Hopkins Hospital Baltimore",
            "state": "FL",
            "availability": {
                "from": "07:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Mount Sinai Hospital",
            "state": "CA",
            "availability": {
                "from": "12:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Tufts Medical Center",
            "state": "KS",
            "availability": {
                "from": "10:00",
                "to": "23:00"
            }
        },
        {
            "clinicName": "UAB Hospital",
            "state": "AK",
            "availability": {
                "from": "11:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Swedish Medical Center",
            "state": "AZ",
            "availability": {
                "from": "07:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "Scratchpay Test Pet Medical Center",
            "state": "CA",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        },
        {
            "clinicName": "Scratchpay Official practice",
            "state": "TN",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        },
        {
            "clinicName": "Good Health Home",
            "state": "FL",
            "availability": {
                "from": "15:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "National Veterinary Clinic",
            "state": "CA",
            "availability": {
                "from": "15:00",
                "to": "22:30"
            }
        },
        {
            "clinicName": "German Pets Clinics",
            "state": "KS",
            "availability": {
                "from": "08:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "City Vet Clinic",
            "state": "NV",
            "availability": {
                "from": "10:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Scratchpay Test Pet Medical Center",
            "state": "CA",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        }
    ]
      
      const response = await request(app)
        .get(`/`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
  });

  describe("availability path /?from=hh:mm&to=hh:mm", () => {
    test("get /?from=7:00&to=8:00 returns 5 results", async () => {
      const expected = [
        {
            "clinicName": "Hopkins Hospital Baltimore",
            "state": "FL",
            "availability": {
                "from": "07:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Swedish Medical Center",
            "state": "AZ",
            "availability": {
                "from": "07:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "Scratchpay Test Pet Medical Center",
            "state": "CA",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        },
        {
            "clinicName": "Scratchpay Official practice",
            "state": "TN",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        },
        {
            "clinicName": "Scratchpay Test Pet Medical Center",
            "state": "CA",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        }
    ]

      const response = await request(app)
        .get(`/?from=7:00&to=8:00`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
    
  });
  describe("name search path /?name=clinicName", () => {
    test("get /?name=Swedish Medical returns 1 results", async () => {
      const expected = [
        {
            "clinicName": "Swedish Medical Center",
            "state": "AZ",
            "availability": {
                "from": "07:00",
                "to": "20:00"
            }
        }
    ]

      const response = await request(app)
        .get(`/?name=Swedish Medical`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
    
  });
  describe("state search path /?state=New York", () => {
    test("get /?state=New York returns 1 results", async () => {
      const expected = [
        {
            "clinicName": "Cleveland Clinic",
            "state": "NY",
            "availability": {
                "from": "11:00",
                "to": "22:00"
            }
        }
    ]

      const response = await request(app)
        .get(`/?state=New York`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
  });
  describe("multiply search paramters", () => {
    test("get /?from=8:00&to=9:00&state=KS returns 1 results", async () => {
      const expected =  [
        {
            "clinicName": "German Pets Clinics",
            "state": "KS",
            "availability": {
                "from": "08:00",
                "to": "20:00"
            }
        }
    ]

      const response = await request(app)
        .get(`/?from=8:00&to=9:00&state=KS`)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
    test("get /?name=Scratchpay&state=California returns 2 results", async () => {
        const expected =  [
            {
                "clinicName": "Scratchpay Test Pet Medical Center",
                "state": "CA",
                "availability": {
                    "from": "00:00",
                    "to": "24:00"
                }
            },
            {
                "clinicName": "Scratchpay Test Pet Medical Center",
                "state": "CA",
                "availability": {
                    "from": "00:00",
                    "to": "24:00"
                }
            }
        ]
  
        const response = await request(app)
          .get(`/?name=Scratchpay&state=California`)
          .set("Accept", "application/json");
  
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expected);
      });
  });
});
