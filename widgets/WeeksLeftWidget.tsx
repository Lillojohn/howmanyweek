import { Text, VStack, HStack, Spacer } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  padding,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";

type WeeksLeftWidgetProps = {
  weeksRemaining: number;
  weeksLived: number;
  totalWeeks: number;
  percentage: number;
  quote: string;
};

const WeeksLeftWidget = (
  props: WeeksLeftWidgetProps,
  environment: WidgetEnvironment
) => {
  "widget";

  const isSmall = environment.widgetFamily === "systemSmall";

  if (isSmall) {
    return (
      <VStack
        modifiers={[
          padding({ all: 16 }),
          frame({ maxWidth: "infinity", maxHeight: "infinity" }),
        ]}
      >
        <Text
          modifiers={[
            font({ weight: "black", size: 11 }),
            foregroundStyle("#FF6B6B"),
          ]}
        >
          WEEKS LEFT
        </Text>
        <Spacer />
        <Text
          modifiers={[
            font({ weight: "black", size: 40, design: "rounded" }),
            foregroundStyle("#000000"),
          ]}
        >
          {props.weeksRemaining.toLocaleString()}
        </Text>
        <Text
          modifiers={[
            font({ weight: "bold", size: 10 }),
            foregroundStyle("#888888"),
          ]}
        >
          {props.percentage.toFixed(0)}% LIVED
        </Text>
      </VStack>
    );
  }

  // Medium and large
  return (
    <VStack
      modifiers={[
        padding({ all: 16 }),
        frame({ maxWidth: "infinity", maxHeight: "infinity" }),
      ]}
    >
      <HStack>
        <Text
          modifiers={[
            font({ weight: "black", size: 11 }),
            foregroundStyle("#FF6B6B"),
          ]}
        >
          WEEKS LEFT
        </Text>
        <Spacer />
        <Text
          modifiers={[
            font({ weight: "bold", size: 10 }),
            foregroundStyle("#888888"),
          ]}
        >
          WEEK {props.weeksLived.toLocaleString()} OF{" "}
          {props.totalWeeks.toLocaleString()}
        </Text>
      </HStack>

      <Spacer />

      <HStack>
        <Text
          modifiers={[
            font({ weight: "black", size: 44, design: "rounded" }),
            foregroundStyle("#000000"),
          ]}
        >
          {props.weeksRemaining.toLocaleString()}
        </Text>
        <Spacer />
        <VStack>
          <Spacer />
          <Text
            modifiers={[
              font({ weight: "semibold", size: 11 }),
              foregroundStyle("#333333"),
              frame({ maxWidth: 160 }),
            ]}
          >
            {props.quote}
          </Text>
        </VStack>
      </HStack>

      <Text
        modifiers={[
          font({ weight: "bold", size: 10 }),
          foregroundStyle("#888888"),
        ]}
      >
        {props.percentage.toFixed(1)}% OF LIFE LIVED
      </Text>
    </VStack>
  );
};

export default createWidget("WeeksLeftWidget", WeeksLeftWidget);
