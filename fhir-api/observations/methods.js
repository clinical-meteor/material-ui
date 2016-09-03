import { Observations } from '/imports/api/observations/observations';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const insertObservation = new ValidatedMethod({
  name: 'observations.insert',
  validate: new SimpleSchema({
    observationType: { type: String },
    observationValue: { type: String },
    observationUnits: { type: String },
    observationStatus: { type: String },
    observationSource: { type: String },
    createdAt: { type: Date },
    patientId: { type: String }
  }).validator(),
  run(document) {
    Observations.insert(document);
  }
});

export const updateObservation = new ValidatedMethod({
  name: 'observations.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.observationType': { type: String, optional: true },
    'update.observationValue': { type: String, optional: true },
    'update.observationUnits': { type: String, optional: true },
    'update.observationStatus': { type: String, optional: true },
    'update.observationSource': { type: String, optional: true },
    'update.patientId': { type: String, optional: true }
  }).validator(),
  run({ _id, update }) {
    Observations.update(_id, { $set: update });
  }
});

export const removeObservation = new ValidatedMethod({
  name: 'observations.remove',
  validate: new SimpleSchema({
    _id: { type: String }
  }).validator(),
  run({ _id }) {
    Observations.remove(_id);
  }
});
