import React, { PropTypes as pt } from 'react';
import { FieldArray } from 'redux-form';
import { connect } from 'react-redux';

import {
  BooleanRadioControlField,
  ControlField,
  ErrorMessageField,
  IntegerControlField,
} from 'control/components/Fields';
import { selector } from 'control/components/RecipeForm';
import ActionFields from 'control/components/action_fields/ActionFields';

const VALUE_FIELDS = {
  string: StringPreferenceField,
  integer: IntegerPreferenceField,
  boolean: BooleanPreferenceField,
};
const DEFAULT_BRANCH_VALUES = {
  slug: '',
  ratio: 1,
};

/**
 * Form fields for the preference-experiment action.
 */
export default class PreferenceExperimentFields extends ActionFields {
  static initialValues = {
    slug: '',
    experimentDocumentUrl: '',
    preferenceName: '',
    preferenceType: 'boolean',
    bucketCount: 10,
  }

  render() {
    return (
      <div className="arguments-fields">
        <p className="info">Run a feature experiment activated by a preference.</p>
        <ControlField
          label="Slug"
          name="arguments.slug"
          component="input"
          type="text"
        />
        <ControlField
          label="Experiment Document URL"
          name="arguments.experimentDocumentUrl"
          component="input"
          type="url"
        />
        <ControlField
          label="Preference Name"
          name="arguments.preferenceName"
          component="input"
          type="text"
        />
        <ControlField
          label="Preference Type"
          name="arguments.preferenceType"
          component="select"
        >
          <option value="boolean">Boolean</option>
          <option value="integer">Integer</option>
          <option value="string">String</option>
        </ControlField>
        <IntegerControlField
          label="Sample of Total Population (out of 100,000 buckets)"
          name="arguments.bucketCount"
        />
        <FieldArray name="arguments.branches" component={PreferenceBranches} />
      </div>
    );
  }
}

export class PreferenceBranches extends React.Component {
  static propTypes = {
    fields: pt.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleClickDelete = ::this.handleClickDelete;
    this.handleClickAdd = ::this.handleClickAdd;
  }

  handleClickDelete(index) {
    this.props.fields.remove(index);
  }

  handleClickAdd() {
    this.props.fields.push({ ...DEFAULT_BRANCH_VALUES });
  }

  render() {
    const { fields } = this.props;
    return (
      <div>
        <h4 className="branch-header">Experiment Branches</h4>
        <ul className="branch-list">
          {fields.map((branch, index) => (
            <li key={index} className="branch">
              <ConnectedBranchFields
                branch={branch}
                index={index}
                onClickDelete={this.handleClickDelete}
              />
            </li>
          ))}
          <li>
            <a
              className="button"
              onClick={this.handleClickAdd}
            >
              <i className="fa fa-plus pre" />
              Add Branch
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export class BranchFields extends React.Component {
  static propTypes = {
    branch: pt.string.isRequired,
    onClickDelete: pt.func.isRequired,
    preferenceType: pt.string.isRequired,
    index: pt.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleClickDelete = ::this.handleClickDelete;
  }

  handleClickDelete() {
    this.props.onClickDelete(this.props.index);
  }

  render() {
    const { branch, preferenceType = 'boolean' } = this.props;
    const ValueField = VALUE_FIELDS[preferenceType];
    return (
      <div className="branch-fields">
        <ControlField
          label="Branch Slug"
          name={`${branch}.slug`}
          component="input"
          type="text"
        />
        <ValueField name={`${branch}.value`} />
        <IntegerControlField
          label="Ratio"
          name={`${branch}.ratio`}
        />
        <div className="remove-branch">
          <a className="button delete" onClick={this.handleClickDelete}>
            <i className="fa fa-times pre" />
            Remove Branch
          </a>
        </div>
      </div>
    );
  }
}

export const ConnectedBranchFields = connect(
  state => ({
    preferenceType: selector(state, 'arguments.preferenceType'),
  })
)(BranchFields);

export function StringPreferenceField(props) {
  return (
    <ControlField
      label="Preference Value"
      component="input"
      type="text"
      {...props}
    />
  );
}

export function BooleanPreferenceField(props) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-label">Preference Value</legend>
      <ErrorMessageField {...props} />
      <BooleanRadioControlField
        label="True"
        value="true"
        hideErrors
        {...props}
      />
      <BooleanRadioControlField
        label="False"
        value="false"
        hideErrors
        {...props}
      />
    </fieldset>
  );
}

export function IntegerPreferenceField(props) {
  return (
    <IntegerControlField label="Preference Value" {...props} />
  );
}
