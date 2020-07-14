function generateBubble(settings) {

    const elemId = settings.element;
    const tooltipSelector = settings.tooltip;
    const margin = settings.margin;
    const width = settings.size.width - margin.left - margin.right;
    const height = settings.size.height - margin.top - margin.bottom;

    const colors = {"1": "Color 1", "2": "Color 2", "3": "Color 3", "4": "Color 5"};
    const color_codes = Object.keys(colors);

    const delta = 1
    // var parseDate = d3.timeParse("%d.%m.%Y");

    // Remove existing SVG element (to avoid duplicating when resizing)
    clearSVG(elemId);

    // Tooltip div is hidden by default
    var tooltip = d3.select(tooltipSelector)

    var bubble_svg = d3.select(elemId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(settings.path, function(error, data) {
        // ---------------------------//
        //       AXIS  AND SCALE      //
        // ---------------------------//

           // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 10 + delta])
                .range([0, width]);

            bubble_svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));

            // X axis label:
            bubble_svg.append("text")
             .attr("text-anchor", "end")
             .attr("x", width)
             .attr("y", height + 30)
             .attr("class", "bubble-axis-label")
             .text("How often I use it");

            // Y axis
            var y = d3.scaleLinear()
                .domain([0, 10 + delta]) // fixed rating - from 0 to 10
                .range([height, 0]);
                bubble_svg.append("g")
                .call(d3.axisLeft(y));

            // Y axis label:
            bubble_svg.append("text")
             .attr("class", "bubble-axis-label")
             .attr("x", 0)
             .attr("y", -10)
             .text("How effective it is")

            var ticks = d3.selectAll(".tick text");
            ticks.attr("class", "bubble-axis-label");

            // Scale for bubble size
            var z = d3.scaleSqrt()
                .domain([0, d3.max(data.map(function(d) {return parseInt(d.seniority);}))])
                .range([2, 30]);

            // Scale for bubble color
            var bubbleColor = d3.scaleOrdinal()
                .domain(color_codes)
                .range(d3.schemeSet1);


        // ---------------------------//
        //      TOOLTIP               //
        // ---------------------------//

           var showTooltip = function(d) {
                tooltip
                 .transition()
                 .duration(100)
                tooltip
                 .style("opacity", 0.9)
                 .html("Debugging tactic: <b>" + d.method + "</b></br>" +
                       "Effectiveness: <b>" + d.effectiveness + "</b><br>" +
                       "frequency: " + d.frequency + "<br>");
            }

            var moveTooltip = function(d) {
                tooltip
                  .style("top", d3.select(this).attr("cy") + "px")
                  .style("left", d3.select(this).attr("cx") + "px")
            }

            var hideTooltip = function(d) {
            tooltip
             .transition()
             .duration(200)
             .style("opacity", 0)
            }


        // ---------------------------//
        //       HIGHLIGHT GROUP      //
        // ---------------------------//

        // When a legend category is hovered
        var highlight = function(d){
            d3.selectAll(".bubbles").style("opacity", .05)
            d3.selectAll("."+d).style("opacity", 1)
        }

        // When a legend category is not hovered anymore
        var noHighlight = function(d){
            d3.selectAll(".bubbles").style("opacity", 1)
        }


        // ---------------------------//
        //       CIRCLES              //
        // ---------------------------//

        bubble_svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function(d) { return "bubbles " + d.color_code })
            .attr("cx", function (d) {  return x(d.frequency); })
            .attr("cy", function (d) { return y(d.effectiveness); })
            .attr("r", function (d) { return z(d.seniority); })
            .style("fill", function (d) { return bubbleColor(d.color_code); })
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip )

        // ---------------------------//
        //       CIRCLE LABELS        //
        // ---------------------------//
        bubble_svg
            .selectAll("dot")
            .data(data)
            .enter()
            .append("text")
            .attr('x', function(d){ return x(parseInt(d.frequency) + 0.3) } )
            .attr('y', function(d){ return y(parseInt(d.effectiveness)) } )
            .text( function(d){ return d.method } )
            //.call(wrapText, 100);


        // ---------------------------//
        //       LEGEND              //
        // ---------------------------//

        legend_label_position_x = width - 70
        legend_circle_position_x = width - 70
        legend_circle_position_y = height - 30
        legend_bubble_position_x = width - 110


        // Legend: bubble sizes
        var valuesToShow = [1, 5, 10]
        var xCircle = legend_bubble_position_x
        var xLabel = legend_label_position_x
        bubble_svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", xCircle)
            .attr("cy", function(d){ return legend_circle_position_y - z(d) } )
            .attr("r", function(d){ return z(d) })
            .style("fill", "none")
            .attr("stroke", "black")

        bubble_svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("line")
            .attr('x1', function(d){ return xCircle + z(d) } )
            .attr('x2', xLabel)
            .attr('y1', function(d){ return legend_circle_position_y - z(d) } )
            .attr('y2', function(d){ return legend_circle_position_y - z(d) } )
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))

        // Legend: labels for bubble sizes
        bubble_svg
            .selectAll("legend")
            .data(valuesToShow)
            .enter()
            .append("text")
            .attr('x', xLabel)
            .attr('y', function(d){ return legend_circle_position_y - z(d) } )
            .text( function(d){ return d } )
            .attr("class", "bubble-legend")

        // Legend title
        bubble_svg.append("text")
            .attr('x', xCircle)
            .attr("y", legend_circle_position_y + 10)
            .text("Seniority level")
            .attr("text-anchor", "middle")
            .attr("class", "bubble-legend")


        // Legend dots
        /* var size = 20

        bubble_svg.selectAll("legend")
         .data(color_codes)
         .enter()
         .append("circle")
           .attr("cx", legend_circle_position_x)
           .attr("cy", function(d,i){ return 10 + i*(size+5)})
           .attr("r", 7)
           .style("fill", function(d){ return bubbleColor(d)})
           .on("mouseover", highlight)
           .on("mouseleave", noHighlight)

        // Category labels for legend dots
         bubble_svg.selectAll("legend")
         .data(color_codes)
         .enter()
         .append("text")
           .attr("x", legend_label_position_x + size*.8)
           .attr("y", function(d,i){ return i * (size + 5) + (size/2)})
           .style("fill", function(d){ return bubbleColor(d)})
           .text(function(d){ return colors[d]})
           .attr("text-anchor", "left")
           .attr("class", "bubble-legend")
           .on("mouseover", highlight)
           .on("mouseleave", noHighlight)
         */
    })
}
    function wrapText(text, width) {
        text.each(function () {
            var textEl = d3.select(this),
                words = textEl.text().split(/\s+/).reverse(),
                word,
                line = [],
                linenumber = 0,
                lineHeight = 1.1, // ems
                y = textEl.attr('y'),
                dx = parseFloat(textEl.attr('dx') || 0),
                dy = parseFloat(textEl.attr('dy') || 0),
                tspan = textEl.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = textEl.append('tspan').attr('x', 0).attr('y', y).attr('dx', dx).attr('dy', ++linenumber * lineHeight + dy + 'em').text(word);
                }
            }
        });
    }