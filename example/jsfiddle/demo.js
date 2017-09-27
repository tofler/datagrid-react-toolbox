const reactRoot = window.document.getElementById('reactRoot');

const data = [
    { row1: 1, row2: 2, row3: 3, row4: 9 },
    { row1: 3, row2: 4, row3: 5, row4: 9 }
];
const columnProperties = [{
    name: 'row1',
    title: 'Row 1',
}, {
    name: 'row2',
    title: 'Row 2',
}, {
    name: 'row3',
    title: 'Row 3',
    
}, {
    name: 'row4',
    title: 'Row 4',
    
}];

class TestDataGrid extends React.Component {
    render() {
    console.log(DataGrid);
    //return (<p>Helllo worws</p>);
    return (
        <window.DataGrid
        columnProperties={columnProperties}
        data={data} caption="Data Grid Test"
      />
    );
  }
  
}

React.render(<TestDataGrid />, reactRoot);
