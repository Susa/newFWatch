var config = {
  headers: {'_token': '{{ csrf_token() }}'}
};

var table;

function post(url, data) {
  const config = {
            headers: { 'processData': false,
                'contentType': 'multipart/form-data'}
        };
  return axios.post(url, data, config).then(function(response){
    return response.data;
  });
}

function patch(url, data) {
  return axios.patch(url, data, config).then(function(response){
    return response.data;
  });
}

function get(url, data) {
  return axios.get(url, data, config).then(function(response){
    return response.data;
  });
}

function destroy(url, data) {
  return axios.delete(url, data, config).then(function(response){
    return response.data;
  });
}

// function generateDataTable(element, url, columns, buttons){
//
//   var html = '<div class="input-group">';
//       html += '<span class="input-group-addon"><i class="fa fa-search"></i></span>';
//       html += '<input type="text" class="form-control search-box input-sm" placeholder="Search here .." />';
//       html += '</div><br>';
//
//   table = $(element).DataTable({
//     "dom": 'Blfrtip',
//     "buttons": buttons,
//     "order": [[0, 'asc']],
//     "paging": true,
//     "filter": true,
//     "lengthChange": false,
//     "ordering": false,
//     "processing": true,
//     "serverSide": false,
//     "ajax": url,
//     "columns": columns
//   });
//
//   //removes default search box
//   $('div.dataTables_filter').remove();
//   //appends new search box and is inserted above the active datatable element
//   $(html).insertBefore(element + '_wrapper');
//
//   $('.search-box').on('keyup', function () {
//     table.search(this.value).draw();
//   });
// }
//
// function reloadDataTable(element){
//   $(element).DataTable().ajax.reload();
// }
