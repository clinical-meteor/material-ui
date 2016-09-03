import { Meteor } from 'meteor/meteor';
import { Observations } from '../observations';

Meteor.publish('observations', function(){
  return Observations.find()
});
