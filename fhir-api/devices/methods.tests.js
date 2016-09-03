/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Devices } from './devices.js';
import { insertDevice, updateDevice, removeDevice } from './methods.js';

describe('Devices methods', function () {
  beforeEach(function () {
    if (Meteor.isServer) {
      resetDatabase();
    }
  });

  it('inserts a document into the Devices collection', function () {
    insertDevice.call({ title: 'You can\'t arrest me, I\'m the Cake Boss!' });
    const getDevice = Devices.findOne({ title: 'You can\'t arrest me, I\'m the Cake Boss!' });
    assert.equal(getDevice.title, 'You can\'t arrest me, I\'m the Cake Boss!');
  });

  it('updates a document in the Devices collection', function () {
    const { _id } = Factory.create('document');

    updateDevice.call({
      _id,
      update: {
        title: 'You can\'t arrest me, I\'m the Cake Boss!',
      },
    });

    const getDevice = Devices.findOne(_id);
    assert.equal(getDevice.title, 'You can\'t arrest me, I\'m the Cake Boss!');
  });

  it('removes a document from the Devices collection', function () {
    const { _id } = Factory.create('document');
    removeDevice.call({ _id });
    const getDevice = Devices.findOne(_id);
    assert.equal(getDevice, undefined);
  });
});
