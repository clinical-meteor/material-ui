import React from 'react';
import ReactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Table } from 'react-bootstrap';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { get } from 'lodash';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';


flattenObservation = function(observation){
  let result = {
    _id: '',
    meta: '',
    category: '',
    code: '',
    valueString: '',
    observationValue: '',
    subject: '',
    subjectId: '',
    status: '',
    device: '',
    createdBy: '',
    effectiveDateTime: '',
    unit: ''
  };

  result._id =  get(observation, 'id') ? get(observation, 'id') : get(observation, '_id');
  result.category = get(observation, 'category.text', '');
  result.code = get(observation, 'code.text', '');
  result.valueString = get(observation, 'valueString', '');
  result.comparator = get(observation, 'valueQuantity.comparator', '');
  result.observationValue = get(observation, 'valueQuantity.value', '');
  result.unit = get(observation, 'valueQuantity.unit', '');
  result.subject = get(observation, 'subject.display', '');
  result.subjectId = get(observation, 'subject.reference', '');
  result.device = get(observation, 'device.display', '');
  result.status = get(observation, 'status', '');
  result.effectiveDateTime =  moment(get(observation, 'effectiveDateTime')).format("YYYY-MM-DD hh:ss a");

  result.meta = get(observation, 'category.text', '');

  return result;
}


export class ObservationsTable extends React.Component {

  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        text: Glass.darkroom()
      },
      selected: [],
      observations: []
    };


    if(this.props.data){
      console.log('this.props.data', this.props.data);

      if(this.props.data.length > 0){              
        this.props.data.forEach(function(observation){
          data.observations.push(flattenObservation(observation));
        });  
      }
    } else {
      let query = {};
      if(this.props.query){
        query = this.props.query
      }
      data.observations = Observations.find(query).map(function(observation){
        return flattenObservation(observation);
      });
    }


    // this could be another mixin
    if (Session.get('glassBlurEnabled')) {
      data.style.filter = "blur(3px)";
      data.style.WebkitFilter = "blur(3px)";
    }

    // this could be another mixin
    if (Session.get('backgroundBlurEnabled')) {
      data.style.backdropFilter = "blur(5px)";
    }

    if(process.env.NODE_ENV === "test") console.log("ObservationsTable[data]", data);
    return data;
  }
  handleChange(row, key, value) {
    const source = this.state.source;
    source[row][key] = value;
    this.setState({source});
  }

  handleSelect(selected) {
    this.setState({selected});
  }
  getDate(){
    return "YYYY/MM/DD";
  }
  noChange(){
    return "";
  }
  rowClick(id){
    Session.set("selectedObservationId", id);
    Session.set('observationPageTabIndex', 2);
    Session.set('observationDetailState', false);
  }
  renderBarcode(id){
    if (this.props.displayBarcodes) {
      return (
        <td><span className="barcode">{id}</span></td>
      );
    }
  }
  renderBarcodeHeader(){
    if (this.props.displayBarcodes) {
      return (
        <th>_id</th>
      );
    }
  }
  
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.observations.length; i++) {
      tableRows.push(
        <tr className="observationRow" key={i} style={this.data.style.text} onClick={ this.rowClick.bind(this, this.data.observations[i]._id)} >

          <td className='meta' style={{width: '100px'}}>
            <FaLock style={{marginLeft: '2px', marginRight: '2px'}} />
            <FaTags style={{marginLeft: '2px', marginRight: '2px'}} />
            <FaCode style={{marginLeft: '2px', marginRight: '2px'}} />
            <FaPuzzlePiece style={{marginLeft: '2px', marginRight: '2px'}} />
          </td>
          <td className='category'>{this.data.observations[i].category }</td>
          <td className='code'>{this.data.observations[i].code }</td>
          <td className='valueString'>{this.data.observations[i].valueString }</td>
          <td className='comparator'>{this.data.observations[i].comparator }</td>
          <td className='value'>{this.data.observations[i].observationValue }</td>
          <td className='unit'>{this.data.observations[i].unit }</td>
          <td className='name'>{this.data.observations[i].subject }</td>
          <td className='status'>{this.data.observations[i].status }</td>
          <td className='device.display'>{this.data.observations[i].device }</td>
          <td className='date'>{this.data.observations[i].effectiveDateTime }</td>
          {this.renderBarcode(this.data.observations[i]._id)}
        </tr>
      );
    }

    return(
      <CardText>
        <Table id="observationsTable" hover >
          <thead>
            <tr>
              <th className='meta'>Meta</th>
              <th className='category'>Category</th>
              <th className='code'>Code</th>
              <th className='valueString'>ValueString</th>
              <th className='comparator'>Comparator</th>
              <th className='value'>Value</th>
              <th className='unit'>Unit</th>
              <th className='name'>Subject</th>
              <th className='status'>Status</th>
              <th className='device.display'>Device</th>
              <th className='date'>Date</th>
              {this.renderBarcodeHeader() }
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </Table>
      </CardText>
    );
  }
}


ReactMixin(ObservationsTable.prototype, ReactMeteorData);
export default ObservationsTable; 