(function () {
  "use strict"

  var
    worktimes_url = "/worktimes";

  $().ready(function() {
    $("div#worktimes tbody").on("click", "a.wt-action-edit", function() {
      var id = $(this).closest("tr").attr("data-id");
      btnEdit(id);
    });

    $("div#worktimes tbody").on("click", "a.wt-action-destroy", function() {
      var id = $(this).closest("tr").attr("data-id");
      actionDestroy(id);
    });

    $("div#worktimes a#add").on("click", function() {
      btnAdd();
    });

    $("div#worktimes").on("keypress", "div#form input", dateTimeMask);

    actionIndex();
  });

  function actionIndex() {
    var jqXHR;

    jqXHR = $.ajax({
      url: worktimes_url,
      dataType: "JSON",
      data: {issue_id: issueId()},
      type: "GET"
    });

    jqXHR.done(renderIndex);
    jqXHR.fail(renderError);
  }

  function issueId() {
    return $("div#worktimes").attr("data-issue_id");
  }

  function renderIndex(worktimes) {
    var tbody = $("div#worktimes tbody");

    worktimes.forEach(function(each) {
      var row,
          worktime = each.worktime;

      row = createRow(worktime);
      tbody.append(row);
    });

    refreshTotal();
  }

  function renderError(jqXHR, textStatus, errorThrown) {
    var flash, divError, ul, li;

    li = $(document.createElement("li"));
    li.html(errorThrown);

    ul = $(document.createElement("ul"));
    ul.append(li);

    divError = $(document.createElement("div"));
    divError.attr("id", "errorExplanation");
    divError.append(ul);

    flash = $("div#worktimes div#flash");
    flash.html(divError);
  }

  function renderFlashSucess(message) {
    var flash, div

    div = $(document.createElement("div"));
    div.attr("id", "flash_notice");
    div.addClass("flash notice")
    div.html(message);

    flash = $("div#worktimes div#flash");
    flash.html(div);
  }

  function btnAdd() {
    var template = $("div#worktimes script#form").html();

    $("div#worktimes div#form").html(template);
    $("div#worktimes div#form a#abandon").on("click", btnAbandon);
    $("div#worktimes div#form a#confirm").on("click", btnConfirmAdd);

    $("div#worktimes div#form input#worktime_started_at").select().focus();
  }

  function btnAbandon() {
    $("div#worktimes div#form").html("");
  }

  function btnConfirmAdd() {
    actionAdd();
  }

  function actionAdd() {
    var jqXHR, started_at, finished_at;

    started_at = encodeDate($("div#worktimes div#form input#worktime_started_at").val());
    finished_at = encodeDate($("div#worktimes div#form input#worktime_finished_at").val());

    jqXHR = $.ajax({
      url: worktimes_url,
      dataType: "JSON",
      data: {
        issue_id: issueId(),
        started_at: started_at,
        finished_at: finished_at
      },
      type: "POST"
    });

    jqXHR.done(renderCreate);
    jqXHR.fail(renderError);
  }

  function encodeDate(value) {
    var encoded = "";

    encoded += value.substr(6, 4) + "-";
    encoded += value.substr(3, 2) + "-";
    encoded += value.substr(0, 2) + " ";
    encoded += value.substr(11, 2) + ":";
    encoded += value.substr(14, 2);

    return encoded;
  }

  function renderCreate(worktime) {
    var row,
        tbody = $("div#worktimes tbody");

    row = createRow(worktime.worktime);
    tbody.append(row);

    renderFlashSucess("Hora trabalhada adicionada");

    btnAbandon();
    refreshTotal();
  }

  function btnEdit(id) {
    var tr, started_at, finished_at, template;

    template = $("div#worktimes script#form").html();

    tr = $("div#worktimes tr[data-id=" + id + "]");
    started_at = tr.find("td[data-field=started_at]").html();
    finished_at = tr.find("td[data-field=finished_at]").html();

    $("div#worktimes div#form").html(template);
    $("div#worktimes div#form").attr("data-id", id);
    $("div#worktimes div#form a#abandon").on("click", btnAbandon);
    $("div#worktimes div#form a#confirm").on("click", btnConfirmEdit);

    $("div#worktimes div#form input#worktime_started_at").val(started_at);
    $("div#worktimes div#form input#worktime_finished_at").val(finished_at);


    $("div#worktimes div#form input#worktime_started_at").select().focus();
  }

  function btnConfirmEdit() {
    var id = $("div#worktimes div#form").attr("data-id");
    actionEdit(id);
  }

  function actionEdit(id) {
    var jqXHR, started_at, finished_at;

    started_at = encodeDate($("div#worktimes div#form input#worktime_started_at").val());
    finished_at = encodeDate($("div#worktimes div#form input#worktime_finished_at").val());

    jqXHR = $.ajax({
      url: worktimes_url,
      dataType: "JSON",
      data: {
        id: id,
        started_at: started_at,
        finished_at: finished_at
      },
      type: "PUT"
    });

    jqXHR.done(renderUpdate);
    jqXHR.fail(renderError);
  }

  function renderUpdate(worktime) {
    var row,
        tr = $("div#worktimes tr[data-id=" + worktime.worktime.id + "]");

    row = createRow(worktime.worktime);
    tr.replaceWith(row);

    renderFlashSucess("Hora trabalhada atualizada");

    btnAbandon();
    refreshTotal();
  }

  function actionDestroy(id) {
    var jqXHR;

    jqXHR = $.ajax({
      url: worktimes_url,
      dataType: "JSON",
      data: {id: id, "_method":"delete"},
      type: "POST",
      context: this
    });

    jqXHR.done(renderDestroy);
    jqXHR.fail(renderError);
  }

  function renderDestroy(values) {
    $("div#worktimes tr[data-id=" + values.id + "]").hide();
    renderFlashSucess("Hora trabalhada removida");
    refreshTotal();
  }

  function createRow(values) {
    var row, started_at, finished_at, worker, workedtime, actions, edit,
        destroy;

    edit = $(document.createElement("a"));
    edit.addClass("icon icon-edit wt-action-edit");

    destroy = $(document.createElement("a"));
    destroy.addClass("icon icon-del wt-action-destroy");

    actions = $(document.createElement("td"));
    actions.append(edit);
    actions.append(destroy);

    started_at = $(document.createElement("td"));
    started_at.attr("data-field", "started_at");
    started_at.html(formatDateTime(values.started_at));

    finished_at = $(document.createElement("td"));
    finished_at.attr("data-field", "finished_at");
    finished_at.html(formatDateTime(values.finished_at));

    worker = $(document.createElement("td"));
    worker.html(values.worker.firstname);

    workedtime = $(document.createElement("td"));
    workedtime.attr("data-seconds", values.workedtime);
    workedtime.html(readableTime(values.workedtime));

    row = $(document.createElement("tr"));
    row.attr("data-id", values.id);
    row.append(actions);
    row.append(started_at);
    row.append(finished_at);
    row.append(worker);
    row.append(workedtime);

    return row;
  }

  function formatDateTime(value) {
    var day, month, year, hours, minutes, seconds;

    day = formatTwoDigits(value.substr(8, 2).toString());
    month = formatTwoDigits(value.substr(5, 2));
    year = value.substr(0, 4).toString();
    hours = formatTwoDigits(value.substr(11, 2));
    minutes = formatTwoDigits(value.substr(14, 2));

    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
  }

  function formatTwoDigits(value) {
    value = value.toString();
    value = "00".substring(0, 2 - value.length) + value;
    return value;
  }

  function readableTime(secondsTotal) {
    var hours, minutes, seconds, formatted;

    hours = Math.floor(secondsTotal / 60 / 60);
    secondsTotal -= (hours * 60 * 60);

    minutes = Math.floor(secondsTotal / 60);
    secondsTotal -= (minutes * 60);

    seconds = secondsTotal;

    formatted = hours + ":" + formatTwoDigits(minutes) + ":" + formatTwoDigits(seconds);

    return formatted;
  }

  function refreshTotal() {
    var secondsTotal = 0;

    $("div#worktimes tbody td[data-seconds]").each(function () {
      secondsTotal += parseInt($(this).attr("data-seconds"));
    });

    $("div#worktimes tfoot td#total").html(readableTime(secondsTotal));
  }

  function dateTimeMask(e) {
    var oldValue, newValue, el;

    if ((e.charCode < 48) || (e.charCode > 57)) return false;

    el = $(this);

    if (el.val().length == 2) {
      el.val(el.val() + '/');
    }

    if (el.val().length == 5) {
      el.val(el.val() + '/');
    }

    if (el.val().length == 10) {
      el.val(el.val() + ' ');
    }

    if (el.val().length == 13) {
      el.val(el.val() + ':');
    }
  }
})();

