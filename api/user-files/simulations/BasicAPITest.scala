package greycollar.api

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class BasicAPITest extends Simulation {

  val httpProtocol = http
    .baseUrl("https://land.greycollar.ai/api")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")
    .userAgentHeader("Gatling/3.9.5")

  val headers = Map(
    "Accept" -> "application/json",
    "Content-Type" -> "application/json"
  )

  val healthCheckScenario = scenario("Health Check")
    .exec(http("Health Check - Metrics")
      .get("/metrics")
      .headers(headers)
      .check(status.is(200))
    )
    .exec(http("Health Check - Root")
      .get("/")
      .headers(headers)
      .check(status.is(200))
    )

  val simpleLoadTest = scenario("Simple Load Test")
    .exec(http("Get Metrics")
      .get("/metrics")
      .headers(headers)
      .check(status.is(200))
    )
    .pause(1)
    .exec(http("Get Metrics Again")
      .get("/metrics")
      .headers(headers)
      .check(status.is(200))
    )

  setUp(
    simpleLoadTest.inject(
      rampUsers(5).during(10.seconds),
      constantUsersPerSec(2).during(1.minute)
    ).protocols(httpProtocol),

    healthCheckScenario.inject(
      constantUsersPerSec(1).during(30.seconds)
    ).protocols(httpProtocol)
  )
  .assertions(
    global.responseTime.mean.lt(1000),
    global.failedRequests.percent.lt(10.0)
  )
}

