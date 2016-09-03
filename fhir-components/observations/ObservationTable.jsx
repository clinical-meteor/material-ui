import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Avatar from 'react-toolbox/lib/avatar';

import { Table } from 'react-bootstrap';


export default class ObservationTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      observations: Observations.find().map(function(observation){
        return {
          _id: observation._id,
          observationType: observation.observationType,
          observationValue: observation.observationValue,
          patientId: observation.patientId,
          observationStatus: observation.observationStatus,
          observationSource: observation.observationSource,
          createdBy: observation.createdBy,
          createdAt: observation.createdAt,
        };
      })
    }

    if (Session.get('darkroomEnabled')) {
      data.style.color = "black";
      data.style.background = "white";
    } else {
      data.style.color = "white";
      data.style.background = "black";
    }

    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.webkitFilter = "blur(3px)";
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = "blur(5px)";
    }

    console.log("data", data);


    return data;
  };
  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  };

  handleSelect(selected) {
    this.setState({selected});
  };
  getDate(){
    return "YYYY/MM/DD"
  };
  noChange(){
    return "";
  };
  rowClick(id){
    // set the user
    Session.set("selectedObservation", id);

    // set which tab is selected
    let state = Session.get('observationCardState');
    state["index"] = 2;
    Session.set('observationCardState', state);
  };
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.observations.length; i++) {
      tableRows.push(
        <tr key={i} className="observationRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.observations[i]._id)} >

          <td>{this.data.observations[i].observationType }</td>
          <td>{this.data.observations[i].observationValue }</td>
          <td>{this.data.observations[i].patientId }</td>
          <td>{this.data.observations[i].createdAt }</td>
          <td>{this.data.observations[i].observationStatus }</td>
          <td>{this.data.observations[i].observationSource }</td>
          <td><span class="barcode">{ this.data.observations[i]._id }</span></td>
        </tr>
      )
    }

    return(
      <Table responses hover >
        <thead>
          <tr>
            <th>type</th>
            <th>value</th>
            <th>patientId</th>
            <th>time</th>
            <th>status</th>
            <th>source</th>
            <th>_id</th>
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
    );
  }
}


ObservationTable.propTypes = {};
ReactMixin(ObservationTable.prototype, ReactMeteorData);
