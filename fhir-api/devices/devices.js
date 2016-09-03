import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';

export const Devices = new Mongo.Collection('Devices');

Devices.schema = new SimpleSchema({
  deviceName: {
    type: String,
    label: 'The name of the device.'
  },
  deviceProductId: {
    type: String,
    label: 'The product id code of the device.'
  },
  patientId: {
    type: String,
    label: 'Patient ID.'
  },
  createdAt: {
    type: Date,
    label: 'Date and time that this device was bound to this patient.'
  },
  createdBy: {
    type: String,
    label: 'Creator of this record.'
  }
});

Devices.attachSchema(Devices.schema);

Factory.define('device', Devices, {
  title: () => faker.hacker.phrase(),
  createdAt: () => new Date()
});
