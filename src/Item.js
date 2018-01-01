import React, { Component } from "react";
import Api from "./lib/Api";
import Value from "./Value";
import { humanize } from "./lib/Utils";
import { CircularProgress } from 'material-ui/Progress';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

class Item extends Component {
  constructor(props) {
    super(props);
    let modelName = props.match.params.modelname;
    let id = props.match.params.id;

     this.state = { modelName: modelName, id: id, label: humanize(modelName), meta: {} }; 
  }

  async componentDidMount() {
    let modelName = this.props.match.params.modelname;
    let id = this.props.match.params.id;

    let schema = await Api.getSchema(modelName);
    let meta = await Api.getMeta(modelName, id);
    
    let properties = {}

    schema.properties.forEach(property => {
      properties[property['fieldName']] = property;
    });

    this.setState({ modelName: modelName, label: humanize(modelName), id: id, meta: meta, schema: schema, properties: properties });
  }

  async componentWillReceiveProps(nextProps) {
    let modelName = nextProps.match.params.modelname;
    let id = nextProps.match.params.id;

    let schema = await Api.getSchema(modelName);
    let meta = await Api.getMeta(modelName, id);
    
    let properties = {}

    schema.properties.forEach(property => {
      properties[property['fieldName']] = property;
    });

    this.setState({ modelName: modelName, label: humanize(modelName), id: id, meta: meta, schema: schema, properties: properties });
  }

  render() {
    let sortedKeys = Object.keys(this.state.meta).sort();
    let items = [];

    sortedKeys.forEach(key => {
      let value = this.state.meta[key];
      items.push(
        <TableRow key={key}>
          <TableCell>{key}</TableCell>
          <TableCell><Value value={value} name={key} property={this.state.properties[key]} /></TableCell>
        </TableRow>
      );
    });

    return (
      <div>
        {items.length === 0 ? (
          <div>
            <h3>
              {this.state.label} ({this.state.id})
            </h3>
            <CircularProgress size={80} thickness={5} />
          </div>
        ) : (
          <div>
            <h3>
              {this.state.label} {this.state.meta.displayName} ({this.state.id})
            </h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{items}</TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}

export default Item;
