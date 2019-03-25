export function geturl() {
  var service_url = ''
  window.$.ajaxSettings.async = false
  window.$.getJSON('./static/config.json', function(d) {
    service_url = d.url
  })
  return service_url
}
