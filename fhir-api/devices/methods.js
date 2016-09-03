import { Devices } from '/imports/api/devices/devices';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertDevice = new ValidatedMethod({
  name: 'devices.insert',
  validate: new SimpleSchema({
    deviceName: { type: String },
    deviceProductId: { type: String },
    createdAt: { type: Date },
    patientId: { type: String }
  }).validator(),
  run(document) {
    Devices.insert(document);
  }
});

export const updateDevice = new ValidatedMethod({
  name: 'devices.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.deviceName': { type: String, optional: true },
    'update.deviceProductId': { type: String, optional: true }
  }).validator(),
  run({ _id, update }) {
    Devices.update(_id, { $set: update });
  }
});

export const removeDevice = new ValidatedMethod({
  name: 'devices.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    Devices.remove(_id);
  }
});
