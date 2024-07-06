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

    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    @IsDate()
    start: Date;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    end: Date;

    @IsNotEmpty()
    calendarId: number;

    @IsNotEmpty()
    color: EventTheme;
}