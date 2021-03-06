import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import {
  withRouter,
} from 'react-router-dom';
import Table from '../../components/Table';
import { projectList } from './data/projectList/actions';
import { remove } from './data/remove/actions';
import Loader from '../../../../components/Loader';
import Error from '../../../../components/Error';
import lang from './lang';
import FormDialog from './components/FormDialog';
import { update } from './data/update/actions';
import makeExcel from './modules/makeExcel';
import UploadDialog from './components/UploadDialog';

const initialState = {
  formDialogOn: false,
  selectedRow: null,
};
class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.props.requestProjectList({
      accountId: this.props.auth.response.id,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.projectList.loading) {
      this.setState(initialState);
    }
  }
  componentWillUnmount() {
    this.props.handleSelect([]);
  }
  handleTableRowClick = (input) => {
    const selected = this.props.projectList.response.find(o => o.id === input);
    this.setState({
      formDialogOn: true,
      selectedRow: selected,
    });
  };
  handleTableMenuClick = (name, data) => {
    switch(name) {
      case 'create': this.props.push('/editor');
        this.props.handleSelect([]);
        break;
      case 'remove':
        const { editor } = this.props.editor.response;
        const projects = this.props.projectList.response.filter(o => data.includes(o.id));
        this.props.requestRemove({
          projects,
          editor,
        });
        this.props.handleSelect([]);
        break;
      default:
        break;
    }
  };
  handleFormSubmit = (input) => {
    this.props.requestUpdate(input);
  };
  handleFormMenuClick = (name, input) => {
    switch(name) {
      case 'download':
        // const { editor } = this.props.editor.response;
        // makeExcel(this.state.changeables, editor.getProjectId());
        // break;
        break;
      case 'editor':
        this.props.push(`/editor/${input}`);
        break;
      default:
        console.log(name);
        break;
    }
  };
  render() {
    const { formDialogOn, selectedRow } = this.state;
    const { translate, projectList, remove, update, editor, auth } = this.props;
    return (
      <React.Fragment>
        {
          projectList.loading || remove.loading ?
            <Loader/> :
          projectList.response ?
            <Table
              title={lang.Project[translate]}
              data={projectList.response.map(o => ({
                ...o,
                quantityForViews: o.views && o.views.length ?
                  `${o.views.length * o.quantity}(${o.views.length}*${o.quantity})` : undefined,
                sumOfPrice: o.views.length ? o.quantity * o.price * o.views.length : o.quantity * o.price,
              }))}
              handleRowClick={this.handleTableRowClick}
              handleMenuClick={this.handleTableMenuClick}
              handleSelect={this.props.handleSelect}
              columnData={[
                { id: 'thumbnails', thumbnails: true, numeric: false, disablePadding: false, label: lang.Thumbnail[translate] },
                { id: 'productName', numeric: false, disablePadding: false, label: lang.ProductName[translate] },
                { id: 'sizeName', numeric: false, disablePadding: false, label: lang.Size[translate]},
                { id: 'quantity', variantValue: 'quantityForViews', numeric: false, disablePadding: false, label: lang.Quantity[translate]},
                { id: 'sumOfPrice', numeric: false, disablePadding: false, label: lang.Price[translate]},
              ]}
            /> : <Error/>
        }
        <FormDialog
          title={lang.ProjectOrderForm[translate]}
          loading={update.loading}
          open={formDialogOn}
          onClose={() => this.setState({
            formDialogOn: false,
          })}
          selected={selectedRow}
          handleSubmit={this.handleFormSubmit}
          handleMenuClick={this.handleFormMenuClick}
          editor={editor.response ? editor.response.editor : null}
          batchNotAllowed={auth.response.type === 'franchisee' }
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.data.auth,
  translate: state.data.language.selected,
  projectList: state.ManagerPage.ProjectManager.data.projectList,
  remove: state.ManagerPage.ProjectManager.data.remove,
  update: state.ManagerPage.ProjectManager.data.update,
  editor: state.ManagerPage.data.editor,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  push,
  requestProjectList: projectList.request,
  requestRemove: remove.request,
  requestUpdate: update.request,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scene));
