package com.banking.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FraudCheckPassedEvent extends BaseEvent {

    private static final long serialVersionUID = 1L;

    private int riskScore;
    private String riskLevel;
    private String decision;
    private List<String> triggeredRules;
}

