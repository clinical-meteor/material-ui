import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

export const Observations = new Mongo.Collection('Observations');

Observations.schema = new SimpleSchema({
  observationType: {
    type: String,
    label: 'The type of observation.'
  },
  observationValue: {
    type: String,
    label: 'The value of the observation.'
  },
  observationUnits: {
    type: String,
    label: 'The units of the observation'
  },
  observationStatus: {
    type: String,
    label: 'The status of the observation.'
  },
  observationSource: {
    type: String,
    label: 'The source of the observation.'
  },
  createdAt: {
    type: Date,
    label: 'Date of the observation.'
  },
  createdBy: {
    type: String,
    label: 'Creator of the observation.'
  },
  patientId: {
    type: String,
    label: 'Patient ID of the observation.'
  }
});

Observations.attachSchema(Observations.schema);

Factory.define('observation', Observations, {
  title: () => faker.hacker.phrase(),
  createdAt: () => new Date()
});
