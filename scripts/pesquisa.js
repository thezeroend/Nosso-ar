function init(tokenId, inputId, outputId) {
    token.id = tokenId;
  
    var input = $(inputId);
    var timer = null;
    var output = $(outputId);
  
    input.on("keyup", function () {
      /* Debounce */
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        search(input.val(), output);
      }, 250);
    });
  }
  
  function search(keyword, output) {
    if (keyword.length == 0) {
        output.html("");
    } else {
        output.html("<h3>Resultados: </h3>");
        output.append($("<div/>").html("Carregando..."));
        output.append($("<div/>").addClass("cp-spinner cp-meter"));
        
        $.getJSON(
            "//api.waqi.info/search/?token=" + token() + "&keyword=" + keyword,
            function (result) {
                output.html("<h3>Resultados:</h3>");
                if (!result || result.status != "ok") {
                    output.append("Desculpe, algo de errado aconteceu: ");
                if (result.data) output.append($("<code>").html(result.data));
                    return;
                }
        
                if (result.data.length == 0) {
                    output.append("Desculpe, não existe nenhuma cidade com este nome no banco!");
                    return;
                }
        
                var table = $("<table/>").addClass("result");
                output.append(table);
        
                output.append(
                    $("<div/>").html("Clique em uma das cidades para exibir os detalhes (Deixe o campo de pesquisa em branco para ocultar as pesquisas)")
                );
        
                var stationInfo = $("<div/>");
                output.append(stationInfo);
        
                result.data.forEach(function (station, i) {
                    var tr = $("<tr>");
                    tr.append($("<td>").html(station.station.name));
                    tr.append($("<td>").html(colorize(station.aqi)));
                    tr.on("click", function () {
                        showStation(station, stationInfo);
                    });
                    table.append(tr);
                    if (i == 0) showStation(station, stationInfo);
                });
            }
        );
    }
  }
  
  function showStation(station, output) {
    $.getJSON(
      "//api.waqi.info/feed/@" + station.uid + "/?token=" + token(),
      function (result) {
        if (!result || result.status != "ok") {
          output.append("Desculpe, Algo de errado aconteceu: ");
          if (result.data) output.append($("<code>").html(result.data));
          return;
        }

        var dadosAtuais = result.data; 
        const dadosCidade = dadosAtuais.city.name.split(',');
        let extensoQualidade = "";
  
        if (dadosAtuais.aqi <= 50) {
          extensoQualidade = "Bom";
        } else if (dadosAtuais.aqi <= 100) {
          extensoQualidade = "Moderado";
        } else if (dadosAtuais.aqi <= 150) {
          extensoQualidade = "Insalubre para grupos sensíveis"
        } else if (dadosAtuais.aqi <= 200) {
          extensoQualidade = "Pouco saudável";
        } else {
          extensoQualidade = "Perigoso";
        }
  
        $('#NomeCidade')[0].textContent = dadosCidade[0];
        $('#NomeEstado')[0].textContent = dadosCidade[1];
        $('#NomePais')[0].textContent = dadosCidade[2];
  
        $('#QualidadeAr')[0].textContent = dadosAtuais.aqi + " - " + extensoQualidade;
        $('#Temperatura')[0].textContent = dadosAtuais.iaqi.t.v + ' ºC';
        $('#Umidade')[0].textContent = dadosAtuais.iaqi.h.v;
      }
    );
  }
  
  function token() {
    return "e19416fb4d02cb742d10908aff9fd86ec1a5255b";
  }