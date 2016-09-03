import { Meteor } from 'meteor/meteor';
import { Devices } from '../devices';

//Meteor.publish('devices', () => Devices.find());

Meteor.publish('devices', function(){
  return Devices.find()
});
