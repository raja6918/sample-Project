package com.adopt.altitude.automation.frontend.data.coterminal;

import com.adopt.altitude.automation.backend.api.coterminals.ExtraTravelTime;
import com.adopt.altitude.automation.backend.api.coterminals.TransportTiming;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DefaultApiCoterminal {

  @Value("${default.be.coterminal.name}")
  public String name;

  @Value("${default.be.coterminal.departureStationCode}")
  public String departureStationCode;

  @Value("${default.be.coterminal.arrivalStationCode}")
  public String arrivalStationCode;

  @Value("${default.be.coterminal.typeCode}")
  public String typeCode;

  @Value("${default.be.coterminal.capacity}")
  public String capacity;

  @Value("${default.be.coterminal.billingPolicyCode}")
  public String billingPolicyCode;

  @Value("${default.be.coterminal.cost}")
  public String cost;

  @Value("${default.be.coterminal.currencyCode}")
  public String currencyCode;

  @Value("${default.be.coterminal.credit}")
  public String credit;

  @Value("${default.be.coterminal.creditPolicyCode}")
  public String creditPolicyCode;

  @Value("${default.be.coterminal.outboundTiming.connectionTimeBefore}")
  public String outboundConnectionTimeBefore;

  @Value("${default.be.coterminal.outboundTiming.connectionTimeAfter}")
  public String outboundConnectionTimeAfter;

  @Value("${default.be.coterminal.outboundTiming.duration}")
  public String outboundConnectionTimeDuration;

  @Value("${default.be.coterminal.outboundTiming.firstDepartureTime}")
  public String outboundFirstDepartureTime;

  @Value("${default.be.coterminal.outboundTiming.lastDepartureTime}")
  public String outboundLastDepartureTime;

  @Value("${default.be.coterminal.outboundTiming.extraTimes.duration}")
  public String extraTimesDuration;

  @Value("${default.be.coterminal.outboundTiming.extraTimes.startTime}")
  public String extraTimesStartTime;

  @Value("${default.be.coterminal.outboundTiming.extraTimes.endTime}")
  public String extraTimesEndTime;

  @Value("${default.be.coterminal.isBidirectional}")
  public Boolean isBidirectional;

  public TransportTiming geTransportTiming() {
    TransportTiming transportTiming = new TransportTiming();

    transportTiming.setConnectionTimeBefore(outboundConnectionTimeBefore);
    transportTiming.setConnectionTimeAfter(outboundConnectionTimeAfter);
    transportTiming.setDuration(outboundConnectionTimeDuration);
    transportTiming.setFirstDepartureTime(outboundFirstDepartureTime);
    transportTiming.setLastDepartureTime(outboundLastDepartureTime);
    transportTiming.setExtraTravelTimes(getExtraTimes());

    return transportTiming;
  }

  public List<ExtraTravelTime> getExtraTimes() {
    String[] extraTimesDurationString = extraTimesDuration.split(",");
    String[] extraTimesStartTimeString = extraTimesStartTime.split(",");
    String[] extraTimesEndTimeString = extraTimesEndTime.split(",");
    List<ExtraTravelTime> extraTimes = new ArrayList<ExtraTravelTime>();

    for(int i=0; i<extraTimesDurationString.length; i++) {
      ExtraTravelTime extraTime = new ExtraTravelTime();

      extraTime.setDuration(extraTimesDurationString[i]);
      extraTime.setStartTime(extraTimesStartTimeString[i]);
      extraTime.setEndTime(extraTimesEndTimeString[i]);

      extraTimes.add(extraTime);
    }

    return extraTimes;
  }
}
