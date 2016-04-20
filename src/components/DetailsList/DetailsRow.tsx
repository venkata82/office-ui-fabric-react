import * as React from 'react';
import { IColumn } from './interfaces';
import { ISelection, SelectionMode, SELECTION_CHANGE } from '../../utilities/selection/interfaces';
import Check from './Check';
import EventGroup from '../../utilities/eventGroup/EventGroup';
import { shallowCompare, assign } from '../../utilities/object';
import { css } from '../../utilities/css';
import DetailsRowFields from './DetailsRowFields';
import './DetailsRow.scss';
import {
  IDragDropHelper,
  IDragDropEvents,
  IDragDropOptions
} from './../../utilities/dragdrop/interfaces';

export interface IDetailsRowProps extends React.Props<DetailsRow> {
  item: any;
  itemIndex: number;
  columns: IColumn[];
  selectionMode: SelectionMode;
  selection: ISelection;
  eventsToRegister?: [{ eventName: string, callback: (item?: any, index?: number, event?: any) => void }];
  onDidMount?: (row?: DetailsRow) => void;
  onWillUnmount?: (row?: DetailsRow) => void;
  dragDropEvents?: IDragDropEvents;
  dragDropHelper?: IDragDropHelper;
  isGrouped?: boolean;
}

export interface IDetailsRowSelectionState {
  isSelected: boolean;
  canFocus: boolean;
}

export interface IDetailsRowState {
  selectionState?: IDetailsRowSelectionState;
  columnMeasureInfo?: {
    index: number;
    column: IColumn;
    onMeasureDone: (measuredWidth: number) => void;
  };
  isDropping?: boolean;
  isGrouped?: boolean;
}

const DEFAULT_DROPPING_CSS_CLASS = 'is-dropping';

export default class DetailsRow extends React.Component<IDetailsRowProps, IDetailsRowState> {
  public refs: {
    [key: string]: React.ReactInstance,
    root: HTMLElement,
    cellMeasurer: HTMLElement
  };

  private _events: EventGroup;
  private _hasSetFocus: boolean;
  private _droppingClassNames: string;
  private _hasMounted: boolean;
  private _dragDropKey: string;

  constructor(props) {
    super(props);

    this.state = {
      selectionState: this._getSelectionState(props),
      columnMeasureInfo: null,
      isDropping: false,
      isGrouped: props.isGrouped
    };

    this._hasSetFocus = false;

    this._events = new EventGroup(this);
    this._droppingClassNames = '';
    this._updateDroppingState = this._updateDroppingState.bind(this);
  }

  public componentDidMount() {
    let { dragDropHelper } = this.props;
    if (dragDropHelper) {
      dragDropHelper.subscribe(this.refs.root, this._events, this._getRowDragDropOptions());
    }

    this._events.on(this.props.selection, SELECTION_CHANGE, this._onSelectionChanged);

    if (this.props.onDidMount && this.props.item) {
      // If the item appears later, we should wait for it before calling this method.
      this._hasMounted = true;
      this.props.onDidMount(this);
    }

    this.setFocus();
  }

  public componentDidUpdate() {
    let state = this.state;
    let { item, onDidMount } = this.props;
    let { columnMeasureInfo } = state;

    if (columnMeasureInfo && columnMeasureInfo.index >= 0) {
      let newWidth = this.refs.cellMeasurer.getBoundingClientRect().width;

      columnMeasureInfo.onMeasureDone(newWidth);

      this.setState({
        columnMeasureInfo: null
      });
    }

    if (item && onDidMount && !this._hasMounted) {
      this._hasMounted = true;
      onDidMount(this);
    }

    this.setFocus();
  }

  public componentWillUnmount() {
    let { item, onWillUnmount, dragDropHelper } = this.props;

    this._events.dispose();

    // Only call the onWillUnmount callback if we have an item.
    if (onWillUnmount && item) {
      onWillUnmount(this);
    }

    if (dragDropHelper) {
      dragDropHelper.unsubscribe(this.refs.root, this._dragDropKey);
    }
  }

  public setFocus() {
    let { selection, itemIndex } = this.props;
    let isFocused = selection.getFocusedIndex() === itemIndex;
    let shouldSetFocus = !!(isFocused && selection.getIsFocusActive() && this.refs.root);

    if (shouldSetFocus) {
      if (!this._hasSetFocus) {
        this._hasSetFocus = true;
        this.refs.root.focus();
      }
    } else {
      this._hasSetFocus = false;
    }
  }

  public componentWillReceiveProps(newProps: IDetailsRowProps) {
    this.setState({
      selectionState: this._getSelectionState(newProps),
      isGrouped: newProps.isGrouped
    });
  }

  public render() {
    let { selectionMode, columns, item, itemIndex, dragDropEvents } = this.props;
    let { selectionState: { isSelected, canFocus }, columnMeasureInfo, isDropping, isGrouped } = this.state;
    let isDraggable = Boolean(dragDropEvents && dragDropEvents.canDrag && dragDropEvents.canDrag(item));
    let droppingClassName = isDropping ? (this._droppingClassNames ? this._droppingClassNames : DEFAULT_DROPPING_CSS_CLASS) : '';
    let key = item ? item.key : '';

    return (
      <div
        ref='root'
        className={ css('ms-DetailsRow ms-font-s', droppingClassName, {
          'is-selected': isSelected
        }) }
        data-selection-key={ key }
        data-selection-index={ itemIndex }
        data-is-draggable={ isDraggable }
        tabIndex={ canFocus ? 0 : -1 }
        >

        { (selectionMode !== SelectionMode.none) && (
          <button
            tabIndex={ -1 }
            className='ms-DetailsRow-check'
            data-selection-toggle={ true }
            >
            <Check isChecked={ isSelected } />
          </button>
        ) }

        { isGrouped && (
          <span className='ms-DetailsRow-collapseGroupSpacer' />
        ) }

        { item && (
          <DetailsRowFields
            columns={ columns }
            item={ item }
            itemIndex={ itemIndex } />
        ) }

        { columnMeasureInfo && (
          <span className='ms-DetailsRow-cellMeasurer ms-DetailsRow-cell' ref='cellMeasurer'>
            <DetailsRowFields columns={ [ columnMeasureInfo.column ] } item={ item } itemIndex={ itemIndex } />
          </span>
        ) }

      </div>
    );
  }

  /**
   * measure cell at index. and call the call back with the measured cell width when finish measure
   *
   * @param {number} index (the cell index)
   * @param {(width: number) => void} onMeasureDone (the call back function when finish measure)
   */
  public measureCell(index: number, onMeasureDone: (width: number) => void) {
    let column = assign({}, this.props.columns[index]) as IColumn;

    column.minWidth = 0;
    column.maxWidth = 999999;
    delete column.calculatedWidth;

    this.setState({
      columnMeasureInfo: {
        index,
        column,
        onMeasureDone
      }
    });
  }

  private _getSelectionState(props: IDetailsRowProps): IDetailsRowSelectionState {
    let { itemIndex, selection } = props;

    return {
      isSelected: selection.isIndexSelected(itemIndex),
      canFocus: selection.getFocusedIndex() === itemIndex
    };
  }

  private _onSelectionChanged() {
    let selectionState = this._getSelectionState(this.props);

    if (!shallowCompare(selectionState, this.state.selectionState)) {
      this.setState({
        selectionState: selectionState
      });
    }
  }

  private _getRowDragDropOptions(): IDragDropOptions {
    let { item, itemIndex, dragDropEvents, eventsToRegister } = this.props;
    this._dragDropKey = 'row-' + itemIndex;
    let options = {
      key: this._dragDropKey,
      eventMap: eventsToRegister,
      selectionIndex: itemIndex,
      context: { data: item, index: itemIndex },
      canDrag: dragDropEvents.canDrag,
      canDrop: dragDropEvents.canDrop,
      onDragStart: dragDropEvents.onDragStart,
      updateDropState: this._updateDroppingState
    };
    return options;
  }

  /**
   * update isDropping state based on the input value, which is used to change style during drag and drop
   *
   * when change to true, that means drag enter. we will add default dropping class name
   * or the custom dropping class name (return result from onDragEnter) to the root elemet.
   *
   * when change to false, that means drag leave. we will remove the dropping class name from root element.
   *
   * @private
   * @param {boolean} newValue (new isDropping state value)
   * @param {DragEvent} event (the event trigger dropping state change which can be dragenter, dragleave etc)
   */
  private _updateDroppingState(newValue: boolean, event: DragEvent) {
    let { selectionState, isDropping } = this.state;
    let { dragDropEvents, item } = this.props;

    if (!newValue) {
      if (dragDropEvents.onDragLeave) {
        dragDropEvents.onDragLeave(item, event);
      }
    } else {
      if (dragDropEvents.onDragEnter) {
        this._droppingClassNames = dragDropEvents.onDragEnter(item, event);
      }
    }

    if (isDropping !== newValue) {
      this.setState({ selectionState: selectionState, isDropping: newValue });
    }
  }
}
