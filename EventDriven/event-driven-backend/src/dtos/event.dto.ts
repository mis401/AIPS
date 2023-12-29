import { Calendar, EventTheme } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, isNotEmpty } from "class-validator";

export class EventDTO {
    @IsNumber()
    @Transform(({ value }) => Number(value))
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsDate()
    start: Date;

    @IsNotEmpty()
    @IsDate()
    end: Date;

    @IsNotEmpty()
    calendarId: number;

    @IsNotEmpty()
    color: EventTheme;
}