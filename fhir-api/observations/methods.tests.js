/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Observations } from './observations.js';
import { insertObservation, updateObservation, removeObservation } from './methods.js';

describe('Observations methods', function () {
  beforeEach(function () {
    if (Meteor.isServer) {
      resetDatabase();
    }
  });

  it('inserts a document into the Observations collection', function () {
	  insertObservation.call({ observationValue: '0.08', observationType: 'BAC', observationStatus: 'OK', observationSource: 0, patientId: 0});
	  const getObservation = Observations.findOne({ observationValue: '0.08' });
	  assert.equal(getObservation.observationValue, '0.08');
  });

  it('updates a document in the Observations collection', function () {
    const { _id } = Factory.create('document');

    updateObservation.call({
      _id,
      update: {
        observationValue: '0.07',
      },
    });

    const getObservation = Observations.findOne(_id);
    assert.equal(getObservation.observationValue, '0.07');
  });

  it('removes a document from the Observations collection', function () {
    const { _id } = Factory.create('document');
    removeObservation.call({ _id });
    const getObservation = Observations.findOne(_id);
    assert.equal(getObservation, undefined);
  });
});
