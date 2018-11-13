import { CardActions, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';

import { GlassCard, VerticalCanvas, Glass, DynamicSpacer } from 'meteor/clinical:glass-ui';
import { Row, Col } from 'react-bootstrap';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { get, set } from 'lodash';



export class ObservationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observationId: false,
      observation: {
        resourceType: 'Observation',
        status: 'preliminary',
        category: {
          text: ''
        },
        effectiveDateTime: '',
        subject: {
          display: '',
          reference: ''
        },
        performer: [],
        device: {
          display: '',
          reference: ''
        },
        valueQuantity: {
          value: '',
          unit: '',
          system: 'http://unitsofmeasure.org'
        },
        valueString: ''
      },
      form: {
        category: '',
        code: '',
        value: '',
        quantity: '',
        unit: '',
        deviceDisplay: '',
        subjectDisplay: '',
        subjectReference: '',
        effectiveDateTime: '',
        loincCode: '',
        loincCodeText: '',
        status: ''
      }
    }
  }
  dehydrateFhirResource(observation) {
    let formData = Object.assign({}, this.state.form);

    formData.category = get(observation, 'type.text')
    formData.code = get(observation, 'code.text')
    formData.value = get(observation, 'valueString')
    formData.comparator = get(observation, 'valueQuantity.comparator')
    formData.quantity = get(observation, 'valueQuantity.value')
    formData.unit = get(observation, 'valueQuantity.unit')
    formData.deviceDisplay = get(observation, 'device.display')
    formData.subjectDisplay = get(observation, 'subject.display')
    formData.subjectReference = get(observation, 'subject.reference')
    formData.effectiveDateTime = get(observation, 'effectiveDateTime')
    formData.status = get(observation, 'status')

    formData.loincCode = get(observation, 'code.codeable[0].code')
    formData.loincCodeText = get(observation, 'code..codeable[0].display')

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('ObservationDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.observation === this.state.observation){
      shouldUpdate = false;
    }

    // received an observation from the table; okay lets update again
    if(nextProps.observationId !== this.state.observationId){
      this.setState({observationId: nextProps.observationId})
      
      if(nextProps.observation){
        this.setState({observation: nextProps.observation})     
        this.setState({form: this.dehydrateFhirResource(nextProps.observation)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      observationId: this.props.observationId,
      observation: false,
      form: this.state.form,
      displayDatePicker: false
    };

    if(this.props.displayDatePicker){
      data.displayDatePicker = this.props.displayDatePicker
    }
    
    if(this.props.observation){
      data.observation = this.props.observation;
    }

    if(process.env.NODE_ENV === "test") console.log("ObservationDetail[data]", data);
    return data;
  }

  renderDatePicker(displayDatePicker, effectiveDateTime){
    console.log('renderDatePicker', displayDatePicker, effectiveDateTime)
    if(typeof effectiveDateTime === "string"){
      effectiveDateTime = moment(effectiveDateTime);
    }
    if (displayDatePicker) {
      return (
        <DatePicker 
          name='effectiveDateTime'
          hintText="Date of Administration" 
          container="inline" 
          mode="landscape"
          value={ effectiveDateTime ? effectiveDateTime : null}    
          onChange={ this.changeState.bind(this, 'effectiveDateTime')}      
          fullWidth
        />
      );
    }
  }
  render() {
    if(process.env.NODE_ENV === "test") console.log('ObservationDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="observationDetail">
        <CardText>
          <Row>
            <Col md={6}>
              <TextField
                id='subjectDisplayInput'
                ref='subjectDisplay'
                name='subjectDisplay'
                floatingLabelText='Subject Name'
                value={ get(formData, 'subjectDisplay') }
                onChange={ this.changeState.bind(this, 'subjectDisplay')}
                hintText='Jane Doe'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='subjectIdInput'
                ref='subjectReference'
                name='subjectReference'
                floatingLabelText='Subject ID'
                value={ get(formData, 'subjectReference') }
                onChange={ this.changeState.bind(this, 'subjectReference')}
                hintText='Patient/12345'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='categoryTextInput'
                ref='category'
                name='category'
                floatingLabelText='Category'
                value={ get(formData, 'category') }
                onChange={ this.changeState.bind(this, 'category')}
                hintText='Vital Signs'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <TextField
                id='comparatorInput'
                ref='comparator'
                name='valueQuantity.comparator'
                floatingLabelText='Comparator'
                hintText='< | <= | >= | >'
                value={ get(formData, 'comparator') }
                onChange={ this.changeState.bind(this, 'comparator')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={2}>
              <TextField
                id='valueQuantityInput'
                ref='quantity'
                name='valueQuantity.value'
                floatingLabelText='Quantity'
                hintText='70.0'
                value={ get(formData, 'quantity') }
                onChange={ this.changeState.bind(this, 'quantity')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={2}>
              <TextField
                id='valueQuantityUnitInput'
                ref='unit'
                name='valueQuantity.unit'
                floatingLabelText='Unit'
                hintText='kg'
                value={ get(formData, 'unit') }
                onChange={ this.changeState.bind(this, 'unit')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='valueStringInput'
                ref='value'
                name='value'
                floatingLabelText='Value'
                hintText='AB+; pos; neg'
                value={ get(formData, 'value') }
                onChange={ this.changeState.bind(this, 'value')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='statusInput'
                ref='status'
                name='status'
                floatingLabelText='Status'
                value={ get(formData, 'status') }
                onChange={ this.changeState.bind(this, 'status')}
                hintText='preliminary | final'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
          <Col md={3}>
              <TextField
                id='loincCodeInput'
                ref='loincCode'
                name='loincCode'
                floatingLabelText='LOINC Code'
                value={ get(formData, 'loincCode') }
                onChange={ this.changeState.bind(this, 'loincCode')}
                hintText='4548-4'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='loincCodeTextInput'
                ref='loincCodeText'
                name='loincCodeText'
                floatingLabelText='LOINC Code Text'
                value={ get(formData, 'loincCodeText') }
                onChange={ this.changeState.bind(this, 'loincCodeText')}
                hintText='HbA1c'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='deviceDisplayInput'
                ref='deviceDisplay'
                name='deviceDisplay'
                floatingLabelText='Device Name'
                value={ get(formData, 'deviceDisplay') }
                onChange={ this.changeState.bind(this, 'deviceDisplay')}
                hintText='iHealth Blood Pressure Cuff'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='deviceReferenceInput'
                ref='deviceReference'
                name='deviceReference'
                floatingLabelText='Device Name'
                // value={ get(formData, 'deviceReference') }
                // onChange={ this.changeState.bind(this, 'deviceReference')}
                hintText='Device/444'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <br />
              { this.renderDatePicker(this.data.displayDatePicker, get(formData, 'effectiveDateTime') ) }
            </Col>

          </Row>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.observationId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(observationId) {
    if (observationId) {
      return (
        <div>
          <RaisedButton id="updateObservationButton" label="Save" className="saveObservationButton" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}  />
          <RaisedButton id="deleteObservationButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return (
        <RaisedButton id="saveObservationButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }
  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ObservationDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "category":
        set(formData, 'category', textValue)
        break;
      case "code":
        set(formData, 'code', textValue)
        break;        
      case "value":
        set(formData, 'value', textValue)
        break;        
      case "comparator":
        set(formData, 'comparator', textValue)
        break;
      case "quantity":
        set(formData, 'quantity', textValue)
        break;
      case "unit":
        set(formData, 'unit', textValue)
        break;
      case "deviceDisplay":
        set(formData, 'deviceDisplay', textValue)
        break;
      case "subjectDisplay":
        set(formData, 'subjectDisplay', textValue)
        break;
      case "subjectReference":
        set(formData, 'subjectReference', textValue)
        break;
      case "effectiveDateTime":
        set(formData, 'effectiveDateTime', textValue)
        break;
      case "status":
        set(formData, 'status', textValue)
        break;
      case "loincCode":
        set(formData, 'loincCode', textValue)
        break;
      case "loincCodeText":
        set(formData, 'loincCodeText', textValue)
        break;
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateObservation(observationData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ObservationDetail.updateObservation", observationData, field, textValue);

    switch (field) {
      case "category":
        set(observationData, 'category.text', textValue)
        break;
      case "code":
        set(observationData, 'code.text', textValue)
        break;        
      case "value":
        set(observationData, 'valueString', textValue)
        break;        
      case "comparator":
        set(observationData, 'valueQuantity.comparator', textValue)
        break;        
      case "quantity":
        set(observationData, 'valueQuantity.value', textValue)
        break;
      case "unit":
        set(observationData, 'valueQuantity.unit', textValue)
        break;
      case "deviceDisplay":
        set(observationData, 'device.display', textValue)
        break;
      case "subjectDisplay":
        set(observationData, 'subject.display', textValue)
        break;
      case "subjectReference":
        set(observationData, 'subject.reference', textValue)
        break;
      case "effectiveDateTime":
        set(observationData, 'effectiveDateTime', textValue)
        break;    
      case "status":
        set(observationData, 'status', textValue)
        break;    
      case "loincCode":
        set(formData, 'code.coding[0].code', textValue)
        break;
      case "loincCodeText":
        set(formData, 'code.coding[0].display', textValue)
        break;
    }
    return observationData;
  }

  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("ObservationDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let observationData = Object.assign({}, this.state.observation);

    formData = this.updateFormData(formData, field, textValue);
    observationData = this.updateObservation(observationData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("observationData", observationData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({observation: observationData})
    this.setState({form: formData})
  }


  
  // this could be a mixin
  handleSaveButton() {
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Observation...', this.state)

    let self = this;
    let fhirObservationData = Object.assign({}, this.state.observation);

    if(process.env.NODE_ENV === "test") console.log('fhirObservationData', fhirObservationData);


    let observationValidator = ObservationSchema.newContext();
    observationValidator.validate(fhirObservationData)

    console.log('IsValid: ', observationValidator.isValid())
    console.log('ValidationErrors: ', observationValidator.validationErrors());

    if (this.data.observationId) {
      if(process.env.NODE_ENV === "test") console.log("Updating observation...");
      delete fhirObservationData._id;

      Observations._collection.update({_id: this.data.observationId}, {$set: fhirObservationData },function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
          console.log('error', error)
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: self.data.observationId});
          Session.set('selectedObservationId', false);
          Session.set('observationPageTabIndex', 1);
          Bert.alert('Observation added!', 'success');
        }
      });
    } else {
      fhirObservationData.effectiveDateTime = new Date();
      if (process.env.NODE_ENV === "test") console.log("create a new observation", fhirObservationData);

      Observations._collection.insert(fhirObservationData, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Observations.insert[error]", error);
          console.log('error', error)
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: self.data.observationId});
          Session.set('selectedObservationId', false);
          Session.set('observationPageTabIndex', 1);
          Bert.alert('Observation added!', 'success');
        }
      });
    }
  }

  // this could be a mixin
  handleCancelButton() {
    Session.set('observationPageTabIndex', 1);
  }

  handleDeleteButton() {
    console.log('Delete observation...', this.data.observationId)
    let self = this;
    Observations._collection.remove({_id: this.data.observationId}, function(error, result){
      if (error) {
        console.log('error', error)
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        Session.set('observationPageTabIndex', 1);
        Session.set('selectedObservationId', false);
        Bert.alert('Observation deleted!', 'success');
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Observations", recordId: self.data.observationId});
      }
    })
  }
}

ObservationDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  observationId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  observation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(ObservationDetail.prototype, ReactMeteorData);
export default ObservationDetail;